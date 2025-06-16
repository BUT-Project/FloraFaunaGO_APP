#!/usr/bin/env tsx
//**
import { UserClient } from '../dal/network/UserClient';
import { ZodHttpClient } from '../dal/network/ZodHttpClient';
import { PagedRequest } from '../shared/PagedRequest';

// Test configuration
const TEST_USER_ID = 'b148b226-f046-47d6-bcb9-e665b65c4246';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJlbWFpbCI6ImRhdmlkQHBvcG8uZnIiLCJ1aWQiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJleHAiOjE3NDk5ODk0MTAsImlzcyI6IkZsb3JhRmF1bmFJc3N1ZXIiLCJhdWQiOiJGbG9yYUZhdW5hSXNzdWVyIn0.-PEF5lf9x-RCJmn1ne3HjxyfEQ5YjnH-aceJZF3fLs4';
const BASE_URL = 'https://codefirst.iut.uca.fr/containers/FloraFauna_GO-api';

// Initialize HTTP client with auth token
const httpClient = new ZodHttpClient({
    baseUrl: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${ACCESS_TOKEN}`
    }
});

// Initialize UserClient
const userClient = new UserClient(httpClient);

async function testUserClient() {
    console.log('🧪 Testing UserClient...\n');

    try {
        // Test 1: Get user by ID
        console.log(`👤 Test 1: Getting user by ID: ${TEST_USER_ID}...`);
        const user = await userClient.getById(TEST_USER_ID);
        console.log('✅ User retrieved:', {
            id: user.id,
            username: user.username,
            email: user.email,
            capturesCount: user.captures?.length || 0
        });
        console.log('');

        // Test 2: Get all users with pagination
        console.log('📋 Test 2: Getting all users (paginated)...');
        const pagedRequest: PagedRequest = {
            index: 0,
            count: 10
        };
        const usersResult = await userClient.getAll(pagedRequest);
        console.log(`✅ Found ${usersResult.items.length} users (total: ${usersResult.total})`);
        
        if (usersResult.items.length > 0) {
            console.log('First few users:');
            usersResult.items.slice(0, 3).forEach((user, index) => {
                console.log(`  ${index + 1}. ${user.username} (${user.email}) - Date: ${user.inscriptionDate.toISOString().split('T')[0]}`);
            });
        }
        console.log('');

        // Test 3: Test pagination with different parameters
        console.log('📄 Test 3: Testing pagination (page 2, 5 items)...');
        const smallPageRequest: PagedRequest = {
            index: 1,
            count: 5
        };
        const smallPageResult = await userClient.getAll(smallPageRequest);
        console.log(`✅ Page 2 results: ${smallPageResult.items.length} users`);
        console.log(`   Total: ${smallPageResult.total}, Current index: ${smallPageResult.index}, Count: ${smallPageResult.count}`);
        console.log('');

        console.log('🎉 All UserClient tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
        }
    }
}

// Run the tests
testUserClient().catch(console.error);
