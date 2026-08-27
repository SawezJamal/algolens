import { useEffect, useRef } from "react";
import { Box, Button, Stack, Typography } from "@mui/material";
import Editor from "@monaco-editor/react";

function CodeEditor({
    code,
    onCodeChange,
    onAnalyze,
    onRun,
    input,
    onInputChange,
    output,
    executionStatus,
    isRunning,
    analysis,
    selectedFinding,
    testResults,
}) {
    const editorRef = useRef(null);
    const decorationsRef = useRef([]);

    const handleEditorMount = (editor) => {
        editorRef.current = editor;
    };

    // Highlight detected lines
    useEffect(() => {
        if (!editorRef.current) {
            return;
        }

        const editor = editorRef.current;

        if (!analysis?.findings) {
            decorationsRef.current = editor.deltaDecorations(
                decorationsRef.current,
                []
            );

            return;
        }

        const decorations = [];

        analysis.findings.forEach((finding) => {
            if (!finding.startLine || !finding.endLine) {
                return;
            }

            decorations.push({
                range: {
                    startLineNumber: finding.startLine,
                    startColumn: 1,
                    endLineNumber: finding.endLine,
                    endColumn: 1,
                },

                options: {
                    isWholeLine: true,
                    className: "algoLens-warning-line",
                    glyphMarginClassName: "algoLens-warning-glyph",
                },
            });
        });

        decorationsRef.current = editor.deltaDecorations(
            decorationsRef.current,
            decorations
        );
    }, [analysis]);

    // Jump to selected finding
    useEffect(() => {
        if (!editorRef.current || !selectedFinding?.startLine) {
            return;
        }

        const editor = editorRef.current;

        const startLine = selectedFinding.startLine;
        const endLine = selectedFinding.endLine || startLine;

        // Select the detected code
        editor.setSelection({
            startLineNumber: startLine,
            startColumn: 1,
            endLineNumber: endLine,
            endColumn: 1,
        });

        // Scroll selected code into the center
        editor.revealLinesInCenter(startLine, endLine);

        // Focus Monaco
        editor.focus();
    }, [selectedFinding]);

    return (
        <Box>
            <Typography
                variant="subtitle1"
                sx={{
                    fontWeight: 600,
                    mb: 1,
                }}
            >
                Code
            </Typography>

            <Box
                sx={{
                    border: "1px solid",
                    borderColor: "rgba(148, 163, 184, 0.2)",
                    borderRadius: 2,
                    overflow: "hidden",
                }}
            >
                <Editor
                    height="400px"
                    defaultLanguage="cpp"
                    theme="vs-dark"
                    value={code}
                    onChange={(value) => onCodeChange(value || "")}
                    onMount={handleEditorMount}
                    options={{
                        minimap: {
                            enabled: false,
                        },
                        fontSize: 14,
                        padding: {
                            top: 16,
                        },
                        automaticLayout: true,
                    }}
                />
            </Box>

            <Stack
                direction="row"
                spacing={2}
                sx={{ mt: 2 }}
            >
                <Button
                    variant="contained"
                    color="primary"
                    onClick={onRun}
                    disabled={isRunning}
                >
                    {isRunning ? "Running..." : "Run Code"}
                </Button>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={onAnalyze}
                >
                    Analyze Code
                </Button>
            </Stack>

            <Box sx={{ mt: 3 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                    }}
                >
                    Custom Input
                </Typography>

                <Box
                    component="textarea"
                    value={input}
                    onChange={(e) => onInputChange(e.target.value)}
                    placeholder="Enter input for your program..."
                    sx={{
                        width: "100%",
                        minHeight: 120,
                        resize: "vertical",
                        boxSizing: "border-box",
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        backgroundColor: "#0b1120",
                        color: "white",
                        fontFamily: "monospace",
                        fontSize: 14,
                        outline: "none",
                    }}
                />
            </Box>

            <Box sx={{ mt: 3 }}>
                <Typography
                    variant="subtitle2"
                    sx={{
                        mb: 1,
                        fontWeight: 600,
                    }}
                >
                    Output
                </Typography>

                {executionStatus && (
                    <Box
                        sx={{
                            mb: 1,
                            fontSize: 13,
                            fontWeight: 600,
                            color:
    executionStatus === "success"
        ? testResults?.allPassed
            ? "success.main"
            : "warning.main"
        : executionStatus === "timeout"
            ? "warning.main"
            : "error.main",
                        }}
                    >
                        {executionStatus === "success" &&
                            (testResults?.allPassed
                                ? "✓ All Test Cases Passed"
                                : "⚠ Execution Completed — Some Test Cases Failed")}
                        {executionStatus === "compilation" && "✕ Compilation Error"}
                        {executionStatus === "runtime" && "✕ Runtime Error"}
                        {executionStatus === "timeout" && "⚠ Time Limit Exceeded"}
                        {executionStatus === "connection" && "✕ Connection Error"}
                    </Box>
                )}

                <Box
                    sx={{
                        minHeight: 120,
                        p: 2,
                        borderRadius: 2,
                        backgroundColor: "#0b1120",
                        border: "1px solid rgba(148, 163, 184, 0.2)",
                        fontFamily: "monospace",
                        fontSize: 14,
                        whiteSpace: "pre-wrap",
                        overflowX: "auto",
                    }}
                >
                    {output || "Output will appear here..."}
                </Box>
                {testResults && (
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            border: "1px solid",
                            borderColor: testResults.allPassed
                                ? "success.main"
                                : "error.main",
                            backgroundColor: "background.paper",
                        }}
                    >
                        <Typography
                            variant="subtitle2"
                            sx={{
                                fontWeight: 700,
                                mb: 1,
                            }}
                        >
                            {testResults.allPassed
                                ? "✓ All Test Cases Passed"
                                : "✕ Some Test Cases Failed"}
                        </Typography>

                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2 }}
                        >
                            Passed {testResults.passed} /{" "}
                            {testResults.total} test cases
                        </Typography>

                        <Stack spacing={1}>
                            {testResults.results.map((result) => (
                                <Box
                                    key={result.testCase}
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        px: 1.5,
                                        py: 1,
                                        borderRadius: 1,
                                        backgroundColor:
                                            "rgba(148, 163, 184, 0.08)",
                                    }}
                                >
                                    <Typography variant="body2">
                                        Test Case {result.testCase}
                                    </Typography>

                                    <Typography
                                        variant="body2"
                                        sx={{
                                            fontWeight: 600,
                                            color: result.passed
                                                ? "success.main"
                                                : "error.main",
                                        }}
                                    >
                                        {result.passed
                                            ? "✓ Passed"
                                            : "✕ Failed"}
                                    </Typography>
                                </Box>
                            ))}
                        </Stack>
                    </Box>
                )}
            </Box>
        </Box>
    );
}

export default CodeEditor;