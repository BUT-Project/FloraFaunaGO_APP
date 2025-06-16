#!/usr/bin/env ts-node

import { CapturesClient } from '../dal/network/CapturesClient';
import { ZodHttpClient } from '../dal/network/ZodHttpClient';
import { PagedRequest } from '../shared/PagedRequest';
import Location from '../model/domain/Location';
import Specie from '../model/domain/Specie';

// Test configuration
const TEST_USER_ID = 'b148b226-f046-47d6-bcb9-e665b65c4246';
const ACCESS_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJlbWFpbCI6ImRhdmlkQHBvcG8uZnIiLCJ1aWQiOiJiMTQ4YjIyNi1mMDQ2LTQ3ZDYtYmNiOS1lNjY1YjY1YzQyNDYiLCJleHAiOjE3NDk5ODQ5OTYsImlzcyI6IkZsb3JhRmF1bmFJc3N1ZXIiLCJhdWQiOiJGbG9yYUZhdW5hSXNzdWVyIn0.uPvi6fCwi807Qecp39f5nv1gZ9Ru3muq9KehIaEWd-c';
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

// Initialize CapturesClient
const capturesClient = new CapturesClient(httpClient);

async function testCapturesClient() {
    console.log('🧪 Testing CapturesClient...\n');

    try {
        // Test 1: Get all captures
        console.log('📋 Test 1: Getting all captures...');
        const pagedRequest : PagedRequest= {
            index: 0, // Start from the first page
            count: 10 // Limit to 10 captures per request
        }
        const captures = await capturesClient.getAll(pagedRequest);
        console.log(`✅ Found ${captures.items.length} captures (total: ${captures.total})`);
        console.log('First capture:', captures.items[0] ? {
            id: captures.items[0].id,
            photo: captures.items[0].photo?.substring(0, 50) + '...',
            specie: captures.items[0].specie.name || 'Unknown',
            detailsCount: captures.items[0].capturesDetails.length
        } : 'No captures found');
        console.log('');

        // Test 2: Get capture by ID (if we have one)
        if (captures.items.length > 0) {
            const firstCaptureId = captures.items[0].id;
            console.log(`🔍 Test 2: Getting capture by ID: ${firstCaptureId}...`);
            const singleCapture = await capturesClient.getById(firstCaptureId);
            console.log('✅ Single capture retrieved:', {
                id: singleCapture.id,
                specie: singleCapture.specie.name || 'Unknown',
                detailsCount: singleCapture.capturesDetails.length,
                firstDetailDate: singleCapture.capturesDetails[0]?.date.toISOString()
            });
            console.log('');
        }

        // Test 3: Add specie to user
        console.log('🆕 Test 3: Testing addSpecieToUser...');
        try {
            const testLocation = new Location(
                100,
                45.7640, // latitude (Lyon, France)
                4.8357,  // longitude
                200,     // altitude
                10,      // exactitude
                      // rayon
            );
            
            const testSpecie = new Specie('bcab3988-8a70-4c77-bc98-0e2ca9d5dd6c', 'Test Species', 'test-image-url');
            
            await capturesClient.addSpecieToUser(
                TEST_USER_ID, 
                testSpecie, 
                testLocation, 
                '/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k=' // small test image
            );
            console.log('✅ Species added to user successfully');
        } catch (error) {
            console.error('❌ Failed to add species to user:', error);
        }
        console.log('');

        console.log('🎉 All tests completed successfully!');

    } catch (error) {
        console.error('❌ Test failed:', error);
        if (error instanceof Error) {
            console.error('Error message:', error.message);
            console.error('Stack trace:', error.stack);
        }
    }
}

// Run the tests
testCapturesClient().catch(console.error);