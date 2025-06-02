import { HttpClient } from '@/dal/network/HttpClient';
import { QueryParams } from '@/shared/PagedRequest';
import { Result } from '@/shared/Result';

// Mock fetch
global.fetch = jest.fn();
const mockFetch = global.fetch as jest.Mock;

// Mock AbortSignal.timeout
const actualAbortSignalTimeoutMock = jest.fn();
Object.defineProperty(AbortSignal, 'timeout', {
    value: actualAbortSignalTimeoutMock,
    configurable: true,
    writable: true,
});

// Test helpers for Result type handling
function expectSuccess<T>(result: Result<T>): asserts result is { success: true; data: T } {
    expect(result.success).toBe(true);
}

function expectFailure<T, E = Error>(result: Result<T, E>): asserts result is { success: false; error: E } {
    expect(result.success).toBe(false);
}

describe('HttpClient', () => {
    const defaultBaseUrl = 'http://localhost:3000/api';

    beforeEach(() => {
        jest.resetAllMocks(); // Resets mock, mockClear, mockReset for all mocks including actualAbortSignalTimeoutMock

        actualAbortSignalTimeoutMock.mockImplementation((timeoutMs: number) => {
            const controller = new AbortController();
            if (timeoutMs <= 0) {
                const reason = new DOMException('Aborted due to non-positive timeout', 'AbortError');
                controller.abort(reason);
            }
            // For positive timeouts, a real AbortSignal.timeout would schedule an abort.
            // In tests, this signal is passed to fetch. The fetch mock simulates the timeout error if needed.
            return controller.signal;
        });

        // Default fetch mock implementation. Specific tests can override this.
        mockFetch.mockImplementation(async (url: URL | RequestInfo, options?: RequestInit) => {
            if (options?.signal?.aborted) {
                // If fetch is called with an already aborted signal, it should throw the signal's reason or a generic AbortError.
                throw options.signal.reason || new DOMException('The operation was aborted.', 'AbortError');
            }
            // Default successful response for tests that don't care about fetch's return
            return Promise.resolve({
                ok: true,
                status: 200,
                statusText: 'OK',
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ message: 'Default mock success' }),
                text: async () => 'Default mock success text',
            });
        });
    });

    test('test_get_request_with_diverse_query_params_parses_json_response', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const queryParams: QueryParams = {
            strParam: 'test',
            numParam: 123,
            boolProp: true,
            nullParam: null,
            undefParam: undefined,
            arrParam: ['a', 1, false, null, undefined, 'value with space'],
            emptyArr: [],
        };
        const expectedData = { id: 1, name: 'Test Data' };
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => expectedData,
            text: async () => JSON.stringify(expectedData),
        });

        const result: Result<typeof expectedData> = await client.get('/items', queryParams);

        expectSuccess(result);
        expect(result.data).toEqual(expectedData);

        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [urlCalled] = mockFetch.mock.calls[0];

        const parsedUrl = new URL(urlCalled as string);
        expect(parsedUrl.origin + parsedUrl.pathname).toBe(`${defaultBaseUrl}/items`);
        expect(parsedUrl.searchParams.get('strParam')).toBe('test');
        expect(parsedUrl.searchParams.get('numParam')).toBe('123');
        expect(parsedUrl.searchParams.get('boolProp')).toBe('true');
        expect(parsedUrl.searchParams.has('nullParam')).toBe(false);
        expect(parsedUrl.searchParams.has('undefParam')).toBe(false);
        expect(parsedUrl.searchParams.getAll('arrParam')).toEqual(['a', '1', 'false', 'value with space']);
        expect(parsedUrl.searchParams.has('emptyArr')).toBe(false);
    });

    test('test_post_request_with_body_and_custom_headers_overrides_defaults', async () => {
        const client = new HttpClient({
            baseUrl: defaultBaseUrl,
            headers: { 'X-Default-Header': 'DefaultValue', 'Content-Type': 'client-config-content-type' },
        });
        const requestBody = { name: 'New Item' };
        const customHeaders = { 'Content-Type': 'application/vnd.api+json', 'X-Custom-Header': 'CustomValue' };
        const expectedResponse = { id: 10, name: 'New Item' };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 201,
            headers: new Headers({ 'Content-Type': 'application/json' }), // Response content type
            json: async () => expectedResponse,
            text: async () => JSON.stringify(expectedResponse),
        });

        const result: Result<typeof expectedResponse> = await client.post('/items', requestBody, customHeaders);

        expectSuccess(result);
        expect(result.data).toEqual(expectedResponse);
        expect(mockFetch).toHaveBeenCalledTimes(1);

        const [, options] = mockFetch.mock.calls[0];
        expect(options?.method).toBe('POST');
        expect(options?.body).toBe(JSON.stringify(requestBody));

        const sentHeaders = options?.headers as Record<string, string>;
        expect(sentHeaders['Content-Type']).toBe('application/vnd.api+json');
        expect(sentHeaders['X-Default-Header']).toBe('DefaultValue');
        expect(sentHeaders['X-Custom-Header']).toBe('CustomValue');
    });

    test('test_successful_request_with_non_json_response_returns_undefined_data', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'text/plain' }),
            text: async () => 'Some text data',
            json: async () => { throw new Error("Should not call json for text/plain"); }
        });

        let result = await client.get('/text-resource');
        expectSuccess(result);
        expect(result.data).toBeUndefined();

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            headers: new Headers(),
            text: async () => '',
            json: async () => { throw new Error("Should not call json for 204 no content-type"); }
        });

        result = await client.get('/no-content-resource');
        expectSuccess(result);
        expect(result.data).toBeUndefined();

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    test('test_http_error_with_non_json_response_body_returns_status_error', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 404,
            statusText: 'Not Found',
            headers: new Headers({ 'Content-Type': 'text/html' }),
            json: jest.fn().mockRejectedValueOnce(new Error('Failed to parse JSON')),
            text: async () => 'Error page',
        });

        let result = await client.get('/not-found-html');
        expectFailure(result);
        expect(result.error?.message).toBe('HTTP 404: Not Found');

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 500,
            statusText: 'Internal Server Error',
            headers: new Headers(),
            json: jest.fn().mockResolvedValueOnce({}),
            text: async () => '',
        });

        result = await client.get('/server-error-empty-body');
        expectFailure(result);
        expect(result.error?.message).toBe('HTTP 500: Internal Server Error');

        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    test('test_network_failure_during_request_returns_error', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const networkError = new Error('Network connection refused');
        mockFetch.mockRejectedValueOnce(networkError);

        const result = await client.get('/some-resource');

        expectFailure(result);
        expect(result.error).toBe(networkError);

        expect(mockFetch).toHaveBeenCalledTimes(1);
    });

    test('test_request_uses_absolute_url_ignoring_client_base_url', async () => {
        const client = new HttpClient({ baseUrl: 'http://should-be-ignored.com/api' });
        const absoluteUrl = 'https://external.service.com/data';
        const expectedData = { result: 'success' };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => expectedData,
            text: async () => JSON.stringify(expectedData),
        });

        const result = await client.get(absoluteUrl);

        expectSuccess(result);
        expect(result.data).toEqual(expectedData);
        expect(mockFetch).toHaveBeenCalledTimes(1);
        const [urlCalled] = mockFetch.mock.calls[0];
        expect(urlCalled).toBe(absoluteUrl);
    });

    // Additional comprehensive test cases
    test('test_malformed_json_response_returns_error', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: jest.fn().mockRejectedValueOnce(new SyntaxError('Unexpected token in JSON')),
            text: async () => '{"invalid": json}',
        });

        const result = await client.get('/malformed-json');

        expectFailure(result);
        expect(result.error).toBeInstanceOf(SyntaxError);
        expect(result.error?.message).toContain('JSON');
    });

    test('test_put_and_delete_methods_work_correctly', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const updateData = { name: 'Updated Item' };

        // Test PUT
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ id: 1, ...updateData }),
            text: async () => JSON.stringify({ id: 1, ...updateData }),
        });

        const putResult = await client.put('/items/1', updateData);
        expectSuccess(putResult);
        expect(putResult.data).toEqual({ id: 1, ...updateData });
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/items/1'),
            expect.objectContaining({ method: 'PUT' })
        );

        // Test DELETE
        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 204,
            headers: new Headers(),
            text: async () => '',
        });

        const deleteResult = await client.delete('/items/1');
        expectSuccess(deleteResult);
        expect(deleteResult.data).toBeUndefined();
        expect(mockFetch).toHaveBeenCalledWith(
            expect.stringContaining('/items/1'),
            expect.objectContaining({ method: 'DELETE' })
        );
    });

    test('test_empty_query_params_object_does_not_add_search_params', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({}),
            text: async () => '{}',
        });

        const result = await client.get('/items', {});

        expectSuccess(result);
        const [urlCalled] = mockFetch.mock.calls[0];
        const parsedUrl = new URL(urlCalled as string);
        expect(parsedUrl.search).toBe('');
    });

    test('test_post_request_with_null_body_sends_no_body', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 201,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ created: true }),
            text: async () => '{"created": true}',
        });

        const result = await client.post('/items', null);

        expectSuccess(result);
        expect(result.data).toEqual({ created: true });

        const [, options] = mockFetch.mock.calls[0];
        expect(options?.body).toBeNull();
    });

    test('test_concurrent_requests_handle_independently', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        // Set up different responses for concurrent requests
        mockFetch
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ id: 1 }),
                text: async () => '{"id": 1}',
            })
            .mockResolvedValueOnce({
                ok: true,
                status: 200,
                headers: new Headers({ 'Content-Type': 'application/json' }),
                json: async () => ({ id: 2 }),
                text: async () => '{"id": 2}',
            });

        const [result1, result2] = await Promise.all([
            client.get('/items/1'),
            client.get('/items/2')
        ]);

        expectSuccess(result1);
        expect(result1.data).toEqual({ id: 1 });
        expectSuccess(result2);
        expect(result2.data).toEqual({ id: 2 });
        expect(mockFetch).toHaveBeenCalledTimes(2);
    });

    test('test_handles_large_response_body', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const largeData = { items: new Array(10000).fill({ id: 1, name: 'item' }) };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => largeData,
            text: async () => JSON.stringify(largeData),
        });

        const result = await client.get<typeof largeData>('/large-dataset');

        expectSuccess(result);
        expect(result.data?.items).toHaveLength(10000);
    });

    test('test_undefined_body_&_null_body_handling', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValue({
            ok: true,
            status: 200,
            headers: new Headers(),
            json: async () => ({}),
            text: async () => '{}',
        });

        const result1 = await client.post('/test', undefined);
        expectSuccess(result1);
        let [, options] = mockFetch.mock.calls[0];
        expect(options?.body).toBeNull();

        const result2 = await client.post('/test', null);
        expectSuccess(result2);
        [, options] = mockFetch.mock.calls[1];
        expect(options?.body).toBeNull();
    });

    test('test_http_error_with_json_error_response_includes_error_details', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const errorResponse = {
            error: 'VALIDATION_FAILED',
            message: 'Name is required',
            details: { field: 'name' }
        };

        mockFetch.mockResolvedValueOnce({
            ok: false,
            status: 400,
            statusText: 'Bad Request',
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => errorResponse,
            text: async () => JSON.stringify(errorResponse),
        });

        const result = await client.post('/items', { name: '' });

        expectFailure(result);
        expect(result.error?.message).toContain('Name is required');
    });

    test('test_request_with_custom_headers_per_request', async () => {
        const client = new HttpClient({
            baseUrl: defaultBaseUrl,
            headers: { 'Authorization': 'Bearer default-token' }
        });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ success: true }),
            text: async () => '{"success": true}',
        });

        const result = await client.get('/protected', undefined, {
            'Authorization': 'Bearer custom-token',
            'X-Request-ID': '123'
        });

        expectSuccess(result);

        const [, options] = mockFetch.mock.calls[0];
        const sentHeaders = options?.headers as Record<string, string>;
        expect(sentHeaders['Authorization']).toBe('Bearer custom-token');
        expect(sentHeaders['X-Request-ID']).toBe('123');
    });

    test('test_patch_method_works_correctly', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const patchData = { name: 'Patched Name' };
        const responseData = { id: 1, name: 'Patched Name', updatedAt: '2024-01-01' };

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => responseData,
            text: async () => JSON.stringify(responseData),
        });

        const result = await client.patch('/items/1', patchData);

        expectSuccess(result);
        expect(result.data).toEqual(responseData);

        const [url, options] = mockFetch.mock.calls[0];
        expect(url).toContain('/items/1');
        expect(options?.method).toBe('PATCH');
        expect(options?.body).toBe(JSON.stringify(patchData));
    });

    test('test_request_without_query_params_has_clean_url', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ data: 'test' }),
            text: async () => '{"data": "test"}',
        });

        const result = await client.get('/items');

        expectSuccess(result);

        const [urlCalled] = mockFetch.mock.calls[0];
        expect(urlCalled).toBe(`${defaultBaseUrl}/items`);
        expect(urlCalled).not.toContain('?');
    });

    test('test_response_with_empty_json_object', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({}),
            text: async () => '{}',
        });

        const result = await client.get('/empty-object');

        expectSuccess(result);
        expect(result.data).toEqual({});
    });

    test('test_response_with_array_data', async () => {
        const client = new HttpClient({ baseUrl: defaultBaseUrl });
        const arrayData = [{ id: 1, name: 'Item 1' }, { id: 2, name: 'Item 2' }];

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => arrayData,
            text: async () => JSON.stringify(arrayData),
        });

        const result = await client.get('/items');

        expectSuccess(result);
        expect(result.data).toEqual(arrayData);
        expect(Array.isArray(result.data)).toBe(true);
        expect(result.data).toHaveLength(2);
    });

    test('test_client_with_no_base_url_uses_relative_urls', async () => {
        const client = new HttpClient({});

        mockFetch.mockResolvedValueOnce({
            ok: true,
            status: 200,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            json: async () => ({ success: true }),
            text: async () => '{"success": true}',
        });

        const result = await client.get('/api/items');

        expectSuccess(result);

        const [urlCalled] = mockFetch.mock.calls[0];
        expect(urlCalled).toBe('/api/items');
    });
});