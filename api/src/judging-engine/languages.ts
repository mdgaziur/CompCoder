export interface languageObject {
    id: number,
    maxCPULimit: number,     // milliseconds
    maxMemoryLimit: number,  // megabytes - max 1024 for all languages because I'm poor af and cannot afford more memory for backend server
    minCPULimit: number,     // milliseconds
    minMemoryLimit: number,  // megabytes
    maxFileSize: number      // kilobytes
    extension: string        // file extension
}


let c: languageObject = {
    id: 1,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'c'
}

let cpp: languageObject = {
    id: 2,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'cpp'
}

let csharp: languageObject = {
    id: 3,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'cs'
}

let python: languageObject = {
    id: 4,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'py'
}

let java: languageObject = {
    id: 5,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'java'
}

let javascript: languageObject = {
    id: 6,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'js'
}

let go: languageObject = {
    id: 7,
    maxCPULimit: 50 * 1000,
    maxMemoryLimit: 1024,
    minCPULimit: 1 * 1000,
    minMemoryLimit: 5,
    maxFileSize: 5 * 1024,
    extension: 'go'
}

export const languages = {
    c: c,
    cpp: cpp,
    csharp: csharp,
    python: python,
    java: java,
    javascript: javascript,
    go: go
}