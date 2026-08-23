import { z } from 'zod';
export declare const TYPERT_REMOTE: {
    package: string;
    descriptors: ({
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    root: z.ZodString;
                    path: z.ZodString;
                    showHidden: z.ZodOptional<z.ZodBoolean>;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    entries: z.ZodArray<z.ZodObject<{
                        name: z.ZodString;
                        isDirectory: z.ZodBoolean;
                        size: z.ZodNumber;
                    }, z.core.$strip>>;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    root: z.ZodString;
                    path: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    content: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    root: z.ZodString;
                    path: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    path: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    root: z.ZodString;
                    repoPath: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    branch: z.ZodString;
                    dirtyCount: z.ZodNumber;
                    changes: z.ZodArray<z.ZodObject<{
                        path: z.ZodString;
                        status: z.ZodUnion<readonly [z.ZodLiteral<"M">, z.ZodLiteral<"A">, z.ZodLiteral<"D">, z.ZodLiteral<"U">]>;
                    }, z.core.$strip>>;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    root: z.ZodString;
                    repoPath: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    output: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    messages: z.ZodArray<z.ZodObject<{
                        role: z.ZodUnion<readonly [z.ZodLiteral<"system">, z.ZodLiteral<"user">, z.ZodLiteral<"assistant">]>;
                        content: z.ZodString;
                    }, z.core.$strip>>;
                    model: z.ZodString;
                    apiBase: z.ZodString;
                    apiKey: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    content: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{}, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    sessions: z.ZodArray<z.ZodObject<{
                        key: z.ZodString;
                        peerId: z.ZodString;
                        kind: z.ZodUnion<readonly [z.ZodLiteral<"group">, z.ZodLiteral<"c2c">]>;
                        messages: z.ZodArray<z.ZodObject<{
                            role: z.ZodUnion<readonly [z.ZodLiteral<"user">, z.ZodLiteral<"assistant">]>;
                            content: z.ZodString;
                        }, z.core.$strip>>;
                        updatedAt: z.ZodNumber;
                    }, z.core.$strip>>;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    key: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    session: z.ZodOptional<z.ZodUnknown>;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    } | {
        id: string;
        service: string;
        namespace: string;
        method: string;
        invocation: {
            kind: "direct";
        };
        parameters: {
            name: string;
            wire: string;
            source: "json";
            codec: {
                mode: "strict";
                typeSymbol: string;
                schema: z.ZodObject<{
                    key: z.ZodString;
                    content: z.ZodString;
                }, z.core.$strip>;
            };
        }[];
        result: {
            mode: "strict";
            typeSymbol: string;
            schema: z.ZodUnion<readonly [z.ZodObject<{
                ok: z.ZodLiteral<true>;
                value: z.ZodObject<{
                    ok: z.ZodBoolean;
                }, z.core.$strip>;
            }, z.core.$strip>, z.ZodObject<{
                ok: z.ZodLiteral<false>;
                error: z.ZodObject<{
                    code: z.ZodString;
                    message: z.ZodString;
                }, z.core.$strip>;
            }, z.core.$strip>]>;
        };
        sourceLocation: {
            file: string;
            line: number;
            column: number;
        };
    })[];
};
export default TYPERT_REMOTE;
