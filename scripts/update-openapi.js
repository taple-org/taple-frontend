#!/usr/bin/env node

/**
 * Script to update openapi.json from the backend API
 * Usage: node scripts/update-openapi.js [BASE_URL]
 * If BASE_URL is not provided, it will use the API_BASE_URL from .env file
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');
const OUTPUT_FILE = path.join(PROJECT_ROOT, 'openapi.json');

function loadEnvFile() {
    const envPath = path.join(PROJECT_ROOT, '.env');
    if (!fs.existsSync(envPath)) {
        return {};
    }

    const envContent = fs.readFileSync(envPath, 'utf-8');
    const env = {};

    for (const line of envContent.split('\n')) {
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith('#')) continue;

        const match = trimmedLine.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            let value = match[2].trim();
            // Remove quotes if present
            if ((value.startsWith('"') && value.endsWith('"')) ||
                (value.startsWith("'") && value.endsWith("'"))) {
                value = value.slice(1, -1);
            }
            env[key] = value;
        }
    }

    return env;
}

async function fetchOpenApi(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        // Fallback to node-fetch or curl if global fetch is not available
        try {
            const result = execSync(`curl -s "${url}"`, { encoding: 'utf-8' });
            return JSON.parse(result);
        } catch (curlError) {
            throw new Error(`Failed to fetch OpenAPI spec: ${error.message}`);
        }
    }
}

async function main() {
    const args = process.argv.slice(2);
    let baseUrl = args[0];

    if (!baseUrl) {
        const env = loadEnvFile();
        baseUrl = env.API_BASE_URL || env.NUXT_PUBLIC_API_BASE || env.PUBLIC_API_BASE;
    }

    if (!baseUrl) {
        console.error('Error: BASE_URL not provided and API_BASE_URL not found in .env file');
        console.error('Usage: node scripts/update-openapi.js [BASE_URL]');
        console.error('Example: node scripts/update-openapi.js https://api.example.com');
        process.exit(1);
    }

    // Remove trailing slash if present
    baseUrl = baseUrl.replace(/\/$/, '');

    const openApiUrl = `${baseUrl}/api/openapi.json`;

    console.log(`Fetching OpenAPI spec from: ${openApiUrl}`);

    try {
        const spec = await fetchOpenApi(openApiUrl);
        fs.writeFileSync(OUTPUT_FILE, JSON.stringify(spec, null, 2));
        console.log(`OpenAPI spec saved to: ${OUTPUT_FILE}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }

    // Check if we should regenerate the API client
    const packageJsonPath = path.join(PROJECT_ROOT, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        if (packageJson.scripts && packageJson.scripts['generate:api']) {
            console.log('Regenerating API client...');
            try {
                execSync('pnpm generate:api', {
                    cwd: PROJECT_ROOT,
                    stdio: 'inherit'
                });
                console.log('API client regenerated successfully');
            } catch (error) {
                console.warn('Warning: Failed to regenerate API client');
            }
        }
    }

    console.log('Done!');
}

main();
