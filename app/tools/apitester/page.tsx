"use client";
import PrivateRoute from "@/components/PrivateRoute";

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

// Type definitions
interface KeyValuePair {
    key: string;
    value: string;
}

interface ResponseObject {
    status: number;
    statusText: string;
    headers: Record<string, string>;
    data: object | string;
    time: number;
}

interface HistoryItem {
    id: number;
    url: string;
    method: string;
    status: number;
    time: string;
}

// HTTP method options
const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

// Content type options
const CONTENT_TYPES = [
    'application/json',
    'application/x-www-form-urlencoded',
    'multipart/form-data',
    'text/plain',
    'text/html',
];

export default function ApiTester() {
    // Request state
    const [url, setUrl] = useState<string>('https://jsonplaceholder.typicode.com/posts');
    const [method, setMethod] = useState<string>('GET');
    const [headers, setHeaders] = useState<KeyValuePair[]>([{ key: '', value: '' }]);
    const [body, setBody] = useState<string>('');
    const [contentType, setContentType] = useState<string>('application/json');
    const [params, setParams] = useState<KeyValuePair[]>([{ key: '', value: '' }]);

    // Response state
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [response, setResponse] = useState<ResponseObject | null>(null);
    const [responseTime, setResponseTime] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeTab, setActiveTab] = useState<string>('body');

    // History state
    const [history, setHistory] = useState<HistoryItem[]>([]);

    // Refs
    const responseBodyRef = useRef<HTMLDivElement>(null);

    // Handle adding a new header input pair
    const addHeader = (): void => {
        setHeaders([...headers, { key: '', value: '' }]);
    };

    // Handle updating a header
    const updateHeader = (index: number, field: 'key' | 'value', value: string): void => {
        const newHeaders = [...headers];
        newHeaders[index][field] = value;
        setHeaders(newHeaders);
    };

    // Handle removing a header
    const removeHeader = (index: number): void => {
        const newHeaders = [...headers];
        newHeaders.splice(index, 1);
        setHeaders(newHeaders);
    };

    // Handle adding a new query param input pair
    const addParam = (): void => {
        setParams([...params, { key: '', value: '' }]);
    };

    // Handle updating a query param
    const updateParam = (index: number, field: 'key' | 'value', value: string): void => {
        const newParams = [...params];
        newParams[index][field] = value;
        setParams(newParams);
    };

    // Handle removing a query param
    const removeParam = (index: number): void => {
        const newParams = [...params];
        newParams.splice(index, 1);
        setParams(newParams);
    };

    // Format the JSON response for readability
    const formatJSON = (json: object): string => {
        try {
            return JSON.stringify(json, null, 2);
        } catch {
            return String(json);
        }
    };

    // Build the complete URL with query parameters
    const getFullUrl = (): string => {
        try {
            const urlObj = new URL(url);

            // Add query parameters from the params array
            params.forEach(param => {
                if (param.key && param.value) {
                    urlObj.searchParams.append(param.key, param.value);
                }
            });

            return urlObj.toString();
        } catch {
            // If URL is invalid, just return the raw URL
            return url;
        }
    };

    // Send the API request
    const sendRequest = async (): Promise<void> => {
        setIsLoading(true);
        setError(null);
        setResponse(null);
        setResponseTime(null);

        try {
            const startTime = performance.now();

            // Build headers object
            const headerObj: Record<string, string> = {};
            headers.forEach(header => {
                if (header.key) {
                    headerObj[header.key] = header.value;
                }
            });

            // Add content-type header if body exists and content-type is not already set
            if (body && !headerObj['Content-Type'] && !headerObj['content-type'] && method !== 'GET') {
                headerObj['Content-Type'] = contentType;
            }

            const requestOptions: RequestInit = {
                method,
                headers: headerObj,
                cache: 'no-cache',
            };

            // Add body for non-GET requests if body exists
            if (method !== 'GET' && body) {
                requestOptions.body = body;
            }

            const fullUrl = getFullUrl();
            const response = await fetch(fullUrl, requestOptions);

            const endTime = performance.now();
            setResponseTime(Math.round(endTime - startTime));

            // Get response data
            let responseData: string | object;
            const contentTypeHeader = response.headers.get('content-type');

            if (contentTypeHeader && contentTypeHeader.includes('application/json')) {
                responseData = await response.json();
            } else {
                responseData = await response.text();
            }

            // Create response object
            const responseObj: ResponseObject = {
                status: response.status,
                statusText: response.statusText,
                headers: Object.fromEntries([...response.headers.entries()]),
                data: responseData,
                time: Math.round(endTime - startTime),
            };

            setResponse(responseObj);

            // Add to history
            const historyItem: HistoryItem = {
                id: Date.now(),
                url: fullUrl,
                method,
                status: response.status,
                time: new Date().toLocaleTimeString(),
            };

            setHistory([historyItem, ...history].slice(0, 10));

        } catch (err) {
            setError(err instanceof Error ? err.message : String(err));
        } finally {
            setIsLoading(false);
        }
    };

    // Copy response to clipboard
    const copyResponse = (): void => {
        if (!response) return;

        let textToCopy = '';

        if (activeTab === 'body') {
            textToCopy = typeof response.data === 'object'
                ? JSON.stringify(response.data, null, 2)
                : String(response.data);
        } else if (activeTab === 'headers') {
            textToCopy = JSON.stringify(response.headers, null, 2);
        }

        navigator.clipboard.writeText(textToCopy);
    };

    // Load a request from history
    const loadFromHistory = (item: HistoryItem): void => {
        setUrl(item.url);
        setMethod(item.method);
    };

    // Clear request form
    const clearRequest = (): void => {
        if (window.confirm('Clear the current request?')) {
            setUrl('');
            setMethod('GET');
            setHeaders([{ key: '', value: '' }]);
            setBody('');
            setParams([{ key: '', value: '' }]);
        }
    };

    return (
        <PrivateRoute>
        <div className="min-h-screen bg-black text-white">
            <div className="container mx-auto py-12 px-4">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <div className="flex items-center mb-8">
                        <motion.div
                            className="text-blue-400 text-4xl mr-4"
                            animate={{ rotate: [0, 10, -10, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 5 }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </motion.div>
                        <div>
                            <h1 className="text-3xl font-bold">API Tester</h1>
                            <p className="text-gray-400">Test your APIs with a simple interface</p>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        {/* Left panel - Request controls */}
                        <div className="lg:col-span-3">
                            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800">
                                {/* URL and method */}
                                <div className="flex flex-col md:flex-row gap-3 mb-6">
                                    <div className="md:w-1/4">
                                        <select
                                            value={method}
                                            onChange={(e) => setMethod(e.target.value)}
                                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        >
                                            {HTTP_METHODS.map((m) => (
                                                <option key={m} value={m}>
                                                    {m}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="flex-1">
                                        <input
                                            type="text"
                                            value={url}
                                            onChange={(e) => setUrl(e.target.value)}
                                            placeholder="Enter request URL"
                                            className="w-full p-3 rounded-lg bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        />
                                    </div>
                                    <motion.button
                                        onClick={sendRequest}
                                        disabled={isLoading || !url}
                                        className={`px-6 py-3 rounded-lg flex items-center justify-center ${isLoading || !url ? 'bg-gray-700 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                        whileHover={!isLoading && url ? { scale: 1.05 } : {}}
                                        whileTap={!isLoading && url ? { scale: 0.95 } : {}}
                                    >
                                        {isLoading ? (
                                            <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                        )}
                                        {isLoading ? 'Sending...' : 'Send'}
                                    </motion.button>
                                    <motion.button
                                        onClick={clearRequest}
                                        className="px-3 py-3 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        title="Clear request"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </motion.button>
                                </div>

                                {/* Tabs */}
                                <div className="mb-6 border-b border-gray-700">
                                    <ul className="flex flex-wrap -mb-px">
                                        <li className="mr-2">
                                            <button
                                                className={`inline-block p-4 ${activeTab === 'params'
                                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                                        : 'border-b-2 border-transparent text-gray-400 hover:text-gray-300'
                                                    }`}
                                                onClick={() => setActiveTab('params')}
                                            >
                                                Query Params
                                            </button>
                                        </li>
                                        <li className="mr-2">
                                            <button
                                                className={`inline-block p-4 ${activeTab === 'headers'
                                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                                        : 'border-b-2 border-transparent text-gray-400 hover:text-gray-300'
                                                    }`}
                                                onClick={() => setActiveTab('headers')}
                                            >
                                                Headers
                                            </button>
                                        </li>
                                        <li className="mr-2">
                                            <button
                                                className={`inline-block p-4 ${activeTab === 'body'
                                                        ? 'border-b-2 border-blue-500 text-blue-500'
                                                        : 'border-b-2 border-transparent text-gray-400 hover:text-gray-300'
                                                    }`}
                                                onClick={() => setActiveTab('body')}
                                            >
                                                Body
                                            </button>
                                        </li>
                                    </ul>
                                </div>

                                {/* Tab content */}
                                <div className="mb-6">
                                    {/* Query Params */}
                                    {activeTab === 'params' && (
                                        <div>
                                            <div className="mb-2 flex justify-between items-center">
                                                <h3 className="text-lg font-semibold">Query Parameters</h3>
                                                <motion.button
                                                    onClick={addParam}
                                                    className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Add
                                                </motion.button>
                                            </div>

                                            <div className="space-y-3">
                                                {params.map((param, index) => (
                                                    <div key={index} className="flex gap-3 items-center">
                                                        <input
                                                            type="text"
                                                            value={param.key}
                                                            onChange={(e) => updateParam(index, 'key', e.target.value)}
                                                            placeholder="Parameter name"
                                                            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={param.value}
                                                            onChange={(e) => updateParam(index, 'value', e.target.value)}
                                                            placeholder="Value"
                                                            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        <button
                                                            onClick={() => removeParam(index)}
                                                            className="p-2 text-gray-400 hover:text-red-400"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Headers */}
                                    {activeTab === 'headers' && (
                                        <div>
                                            <div className="mb-2 flex justify-between items-center">
                                                <h3 className="text-lg font-semibold">HTTP Headers</h3>
                                                <motion.button
                                                    onClick={addHeader}
                                                    className="flex items-center text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded"
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                    Add
                                                </motion.button>
                                            </div>

                                            <div className="space-y-3">
                                                {headers.map((header, index) => (
                                                    <div key={index} className="flex gap-3 items-center">
                                                        <input
                                                            type="text"
                                                            value={header.key}
                                                            onChange={(e) => updateHeader(index, 'key', e.target.value)}
                                                            placeholder="Header name"
                                                            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        <input
                                                            type="text"
                                                            value={header.value}
                                                            onChange={(e) => updateHeader(index, 'value', e.target.value)}
                                                            placeholder="Value"
                                                            className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                        />
                                                        <button
                                                            onClick={() => removeHeader(index)}
                                                            className="p-2 text-gray-400 hover:text-red-400"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* Body */}
                                    {activeTab === 'body' && (
                                        <div>
                                            <div className="mb-3">
                                                <label className="block text-sm text-gray-400 mb-1">Content Type</label>
                                                <select
                                                    value={contentType}
                                                    onChange={(e) => setContentType(e.target.value)}
                                                    className="p-2 bg-gray-800 border border-gray-700 rounded text-sm w-full md:w-auto focus:outline-none focus:ring-1 focus:ring-blue-500"
                                                    disabled={method === 'GET'}
                                                >
                                                    {CONTENT_TYPES.map((type) => (
                                                        <option key={type} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </select>
                                                {method === 'GET' && (
                                                    <p className="text-sm text-yellow-400 mt-1">
                                                        GET requests cannot have a body.
                                                    </p>
                                                )}
                                            </div>

                                            <textarea
                                                value={body}
                                                onChange={(e) => setBody(e.target.value)}
                                                placeholder={method !== 'GET' ? "Enter request body here (JSON, etc.)" : "GET requests do not have a body"}
                                                className="h-64 w-full p-4 bg-gray-800 border border-gray-700 rounded font-mono text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                                disabled={method === 'GET'}
                                            />

                                            {contentType === 'application/json' && body && (
                                                <div className="flex justify-end mt-2">
                                                    <button
                                                        onClick={() => {
                                                            try {
                                                                const formatted = JSON.stringify(JSON.parse(body), null, 2);
                                                                setBody(formatted);
                                                            } catch (e) {
                                                                alert('Invalid JSON: ' + (e instanceof Error ? e.message : String(e)));
                                                            }
                                                        }}
                                                        className="text-sm text-blue-400 hover:text-blue-300"
                                                    >
                                                        Format JSON
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Response section */}
                            {(response || error) && (
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="mt-6 bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800"
                                >
                                    {/* Response header */}
                                    <div className="flex flex-col md:flex-row justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-semibold">Response</h3>
                                            {response && (
                                                <div className="flex items-center gap-2 mt-1">
                                                    <div className={`h-3 w-3 rounded-full ${response.status >= 200 && response.status < 300 ? 'bg-green-500' : response.status >= 400 ? 'bg-red-500' : 'bg-yellow-500'}`}></div>
                                                    <span className="text-sm font-mono">
                                                        Status: {response.status} {response.statusText}
                                                    </span>
                                                    {responseTime && (
                                                        <span className="text-sm text-gray-400">
                                                            ({responseTime} ms)
                                                        </span>
                                                    )}
                                                </div>
                                            )}
                                        </div>

                                        {response && (
                                            <button
                                                onClick={copyResponse}
                                                className="flex items-center text-sm text-blue-400 hover:text-blue-300"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                                </svg>
                                                Copy Response
                                            </button>
                                        )}
                                    </div>

                                    {/* Response tabs for headers and body */}
                                    {response && (
                                        <>
                                            <div className="mb-4 border-b border-gray-700">
                                                <ul className="flex flex-wrap -mb-px">
                                                    <li className="mr-2">
                                                        <button
                                                            className={`inline-block p-2 ${activeTab === 'body'
                                                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                                                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-300'
                                                                }`}
                                                            onClick={() => setActiveTab('body')}
                                                        >
                                                            Body
                                                        </button>
                                                    </li>
                                                    <li className="mr-2">
                                                        <button
                                                            className={`inline-block p-2 ${activeTab === 'headers'
                                                                    ? 'border-b-2 border-blue-500 text-blue-500'
                                                                    : 'border-b-2 border-transparent text-gray-400 hover:text-gray-300'
                                                                }`}
                                                            onClick={() => setActiveTab('headers')}
                                                        >
                                                            Headers
                                                        </button>
                                                    </li>
                                                </ul>
                                            </div>

                                            {/* Response body */}
                                            {activeTab === 'body' && (
                                                <div ref={responseBodyRef} className="overflow-auto max-h-96 bg-gray-800 p-4 rounded border border-gray-700">
                                                    <pre className="font-mono text-sm whitespace-pre-wrap">
                                                        {typeof response.data === 'object'
                                                            ? formatJSON(response.data)
                                                            : response.data}
                                                    </pre>
                                                </div>
                                            )}

                                            {/* Response headers */}
                                            {activeTab === 'headers' && (
                                                <div className="overflow-auto max-h-96 bg-gray-800 p-4 rounded border border-gray-700">
                                                    <pre className="font-mono text-sm whitespace-pre-wrap">
                                                        {formatJSON(response.headers)}
                                                    </pre>
                                                </div>
                                            )}
                                        </>
                                    )}

                                    {/* Error message */}
                                    {error && (
                                        <div className="bg-red-900 bg-opacity-30 p-4 rounded border border-red-800">
                                            <div className="flex items-start">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-400 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <div>
                                                    <h4 className="font-semibold text-red-400">Request Failed</h4>
                                                    <p className="text-sm">{error}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </motion.div>
                            )}
                        </div>

                        {/* Right panel - History */}
                        <div className="lg:col-span-1">
                            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800">
                                <h3 className="text-lg font-semibold mb-4">Request History</h3>

                                {history.length === 0 ? (
                                    <p className="text-gray-400 text-sm">No requests yet. Send an API request to see history.</p>
                                ) : (
                                    <div className="space-y-3">
                                        {history.map((item) => (
                                            <motion.div
                                                key={item.id}
                                                className="p-3 bg-gray-800 rounded border border-gray-700 cursor-pointer hover:bg-gray-750"
                                                whileHover={{ scale: 1.02 }}
                                                onClick={() => loadFromHistory(item)}
                                            >
                                                <div className="flex justify-between items-center">
                                                    <div className={`px-2 py-0.5 rounded-full text-xs ${item.status >= 200 && item.status < 300
                                                            ? 'bg-green-900 text-green-300'
                                                            : item.status >= 400
                                                                ? 'bg-red-900 text-red-300'
                                                                : 'bg-yellow-900 text-yellow-300'
                                                        }`}>
                                                        {item.status}
                                                    </div>
                                                    <span className="text-xs text-gray-400">{item.time}</span>
                                                </div>
                                                <div className="mt-1">
                                                    <div className="flex items-center">
                                                        <span className={`text-sm font-semibold ${item.method === 'GET'
                                                                ? 'text-green-400'
                                                                : item.method === 'POST'
                                                                    ? 'text-yellow-400'
                                                                    : item.method === 'PUT'
                                                                        ? 'text-blue-400'
                                                                        : item.method === 'DELETE'
                                                                            ? 'text-red-400'
                                                                            : 'text-gray-400'
                                                            }`}>
                                                            {item.method}
                                                        </span>
                                                        <span className="text-gray-400 text-xs ml-2">
                                                            {item.url.length > 30 ? item.url.substring(0, 30) + '...' : item.url}
                                                        </span>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="bg-gray-900 rounded-lg p-6 shadow-lg border border-gray-800 mt-6">
                                <h3 className="text-lg font-semibold mb-4">Quick Examples</h3>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => {
                                            setUrl('https://jsonplaceholder.typicode.com/posts');
                                            setMethod('GET');
                                            setBody('');
                                        }}
                                        className="w-full text-left p-2 text-blue-400 hover:bg-gray-800 rounded text-sm"
                                    >
                                        GET Posts
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUrl('https://jsonplaceholder.typicode.com/posts/1');
                                            setMethod('GET');
                                            setBody('');
                                        }}
                                        className="w-full text-left p-2 text-blue-400 hover:bg-gray-800 rounded text-sm"
                                    >
                                        GET Single Post
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUrl('https://jsonplaceholder.typicode.com/posts');
                                            setMethod('POST');
                                            setContentType('application/json');
                                            setBody(JSON.stringify({
                                                title: 'foo',
                                                body: 'bar',
                                                userId: 1
                                            }, null, 2));
                                        }}
                                        className="w-full text-left p-2 text-blue-400 hover:bg-gray-800 rounded text-sm"
                                    >
                                        POST New Post
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUrl('https://jsonplaceholder.typicode.com/posts/1');
                                            setMethod('PUT');
                                            setContentType('application/json');
                                            setBody(JSON.stringify({
                                                id: 1,
                                                title: 'Updated Title',
                                                body: 'Updated Content',
                                                userId: 1
                                            }, null, 2));
                                        }}
                                        className="w-full text-left p-2 text-blue-400 hover:bg-gray-800 rounded text-sm"
                                    >
                                        PUT Update Post
                                    </button>
                                    <button
                                        onClick={() => {
                                            setUrl('https://jsonplaceholder.typicode.com/posts/1');
                                            setMethod('DELETE');
                                            setBody('');
                                        }}
                                        className="w-full text-left p-2 text-blue-400 hover:bg-gray-800 rounded text-sm"
                                    >
                                        DELETE Post
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
        </PrivateRoute>
    );
}