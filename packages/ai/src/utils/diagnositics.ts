export interface DiagnositicErrorInfo {
    name?: string;
    message: string;
    stack?: string;
    code?: string | number;
}

export interface AssistantMessageDiagnostic{
    type: string;
    timestamp: number;
    error?: DiagnositicErrorInfo;
    details?: Record<string, unknown>;
}
export function formatThrowValue(value: unknown): string {
    if (value instanceof Error) return value.message || value.name;
    if (typeof value === "string" ) return value;
    return String(value);
}
export function extractDiagnositicError(error : unknown): DiagnositicErrorInfo {
if (!(error instanceof Error)) return {name: "ThrowValue" , message: formatThrowValue(error)};
const code = (error as Error & {code?: unknown}).code;
return {
    name: error.name || undefined,
    message: error.message || error.name,
    stack: error.stack,
    code: typeof code === "string" || typeof code === "number" ? code : undefined,
}
} 

export function createAssistantMessageDiagnostic(
    type: string,
    error: unknown,
    details?: Record<string, unknown>, 
): AssistantMessageDiagnostic {
    return {
        type,
        timestamp: Date.now(),
        error: extractDiagnositicError(error),
        details
    };
}

export function appendAssistantMessageDiagnostic<T extends {diagnositics?: AssistantMessageDiagnostic[]}>(
    message: T,
    diagnostic: AssistantMessageDiagnostic,
): void {
    message.diagnositics = [... (message.diagnositics ?? []), diagnostic];
}