window.__ModuleLoader__.load({ id: "dsh-shiningweb-ui", factory: (require) => {
"use strict";
var module = { exports: {} }; var exports = module.exports;
//#region rolldown:runtime
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
	if (from && typeof from === "object" || typeof from === "function") for (var keys = __getOwnPropNames(from), i = 0, n = keys.length, key; i < n; i++) {
		key = keys[i];
		if (!__hasOwnProp.call(to, key) && key !== except) __defProp(to, key, {
			get: ((k) => from[k]).bind(null, key),
			enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable
		});
	}
	return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", {
	value: mod,
	enumerable: true
}) : target, mod));

//#endregion
const __deepseek_ai_schemastery = __toESM(require("@deepseek-ai/schemastery"));
const react = __toESM(require("react"));
const zod = __toESM(require("zod"));
const react_jsx_runtime = __toESM(require("react/jsx-runtime"));

//#region src/settings.ts
/** Host settings 命名空间。 */
const SETTINGS_NAMESPACE = "shining";
/** 设置 schema：wire 校验与默认值。 */
const ShiningSettingsSchema = __deepseek_ai_schemastery.default.object({
	enabled: __deepseek_ai_schemastery.default.boolean().default(true),
	capabilityMode: __deepseek_ai_schemastery.default.union([
		__deepseek_ai_schemastery.default.const("pet"),
		__deepseek_ai_schemastery.default.const("assistant"),
		__deepseek_ai_schemastery.default.const("super")
	]).default("pet"),
	chat: __deepseek_ai_schemastery.default.object({
		enabled: __deepseek_ai_schemastery.default.boolean().default(true),
		personaId: __deepseek_ai_schemastery.default.string().default(""),
		model: __deepseek_ai_schemastery.default.string().default("deepseek-chat"),
		apiBase: __deepseek_ai_schemastery.default.string().default("https://api.deepseek.com"),
		apiKey: __deepseek_ai_schemastery.default.string().default("")
	}).default({
		enabled: true,
		personaId: "",
		model: "deepseek-chat",
		apiBase: "https://api.deepseek.com",
		apiKey: ""
	}),
	fileExplorer: __deepseek_ai_schemastery.default.object({
		enabled: __deepseek_ai_schemastery.default.boolean().default(true),
		showHidden: __deepseek_ai_schemastery.default.boolean().default(false)
	}).default({
		enabled: true,
		showHidden: false
	}),
	git: __deepseek_ai_schemastery.default.object({
		enabled: __deepseek_ai_schemastery.default.boolean().default(true),
		autoRefresh: __deepseek_ai_schemastery.default.union([
			__deepseek_ai_schemastery.default.const("off"),
			__deepseek_ai_schemastery.default.const("10s"),
			__deepseek_ai_schemastery.default.const("30s"),
			__deepseek_ai_schemastery.default.const("1m")
		]).default("off")
	}).default({
		enabled: true,
		autoRefresh: "off"
	}),
	visual: __deepseek_ai_schemastery.default.object({
		themeColor: __deepseek_ai_schemastery.default.union([
			__deepseek_ai_schemastery.default.const("galaxy-blue"),
			__deepseek_ai_schemastery.default.const("dawn-gold"),
			__deepseek_ai_schemastery.default.const("aurora-purple")
		]).default("galaxy-blue"),
		glassBlur: __deepseek_ai_schemastery.default.number().min(0).max(24).default(12)
	}).default({
		themeColor: "galaxy-blue",
		glassBlur: 12
	}),
	qq: __deepseek_ai_schemastery.default.object({
		enabled: __deepseek_ai_schemastery.default.boolean().default(false),
		appId: __deepseek_ai_schemastery.default.string().default(""),
		appSecret: __deepseek_ai_schemastery.default.string().default(""),
		groupAllow: __deepseek_ai_schemastery.default.array(__deepseek_ai_schemastery.default.string()).default([]),
		personaPrompt: __deepseek_ai_schemastery.default.string().default("你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。")
	}).default({
		enabled: false,
		appId: "",
		appSecret: "",
		groupAllow: [],
		personaPrompt: "你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。"
	})
});
/** schema 校验通过的默认值。 */
const DEFAULT_SHINING_SETTINGS = {
	enabled: true,
	capabilityMode: "pet",
	chat: {
		enabled: true,
		personaId: "",
		model: "deepseek-chat",
		apiBase: "https://api.deepseek.com",
		apiKey: ""
	},
	fileExplorer: {
		enabled: true,
		showHidden: false
	},
	git: {
		enabled: true,
		autoRefresh: "off"
	},
	visual: {
		themeColor: "galaxy-blue",
		glassBlur: 12
	},
	qq: {
		enabled: false,
		appId: "",
		appSecret: "",
		groupAllow: [],
		personaPrompt: "你是天圆地方，一位温柔而能干的助理。请用简洁、亲切的中文回答。"
	}
};

//#endregion
//#region src/client/locales.ts
/** dsh-shiningweb-ui client 字典。 */
const NS = "shining";
const dict = {
	zh: {
		entryChat: "天圆地方",
		entryFiles: "文件",
		settingsTitle: "璀璨星河",
		chatTitle: "天圆地方",
		send: "发送",
		sendPlaceholder: "输入消息…",
		close: "关闭",
		fileFilter: "过滤文件…",
		newFile: "新建文件",
		newDir: "新建文件夹",
		rename: "重命名",
		remove: "删除",
		copyPath: "复制路径",
		dirtyCount: "未提交",
		refresh: "刷新"
	},
	en: {
		entryChat: "Tianyuan Difang",
		entryFiles: "Files",
		settingsTitle: "Shining Web",
		chatTitle: "Tianyuan Difang",
		send: "Send",
		sendPlaceholder: "Type a message…",
		close: "Close",
		fileFilter: "Filter files…",
		newFile: "New File",
		newDir: "New Folder",
		rename: "Rename",
		remove: "Delete",
		copyPath: "Copy Path",
		dirtyCount: "Dirty",
		refresh: "Refresh"
	}
};

//#endregion
//#region src/client/settings.ts
let scope = null;
/** apply 时绑定 settingsScope。 */
function bindSettingsScope(s$1) {
	scope = s$1;
}
function snapshot() {
	return scope?.getSnapshot().value ?? DEFAULT_SHINING_SETTINGS;
}
/** 读取当前设置（随 settingsScope 变化重渲染）。 */
function useSettings() {
	return (0, react.useSyncExternalStore)((l) => {
		scope?.subscribe(l);
		return () => {};
	}, snapshot);
}
/** 写入一个设置字段（经绑定 scope）。 */
async function writeSetting(field, value) {
	await scope?.set(field, value);
}

//#endregion
//#region src/client/visual.ts
const THEME_COLORS = {
	"galaxy-blue": {
		primary: "#4f7cff",
		accent: "#7aa0ff"
	},
	"dawn-gold": {
		primary: "#e0a43b",
		accent: "#f2c56b"
	},
	"aurora-purple": {
		primary: "#9a6bff",
		accent: "#c39bff"
	}
};
/** 将设置投影到 CSS 变量（浏览器环境调用）。 */
function applyVisual(settings) {
	if (typeof document === "undefined") return;
	const root$1 = document.documentElement;
	const color = THEME_COLORS[settings?.visual.themeColor ?? "galaxy-blue"];
	root$1.style.setProperty("--shining-primary", color.primary);
	root$1.style.setProperty("--shining-accent", color.accent);
	root$1.style.setProperty("--shining-blur", `${settings?.visual.glassBlur ?? 12}px`);
}

//#endregion
//#region src/client/remote.ts
const req_fsList = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string(),
	showHidden: zod.z.boolean().optional()
});
const res_fsList = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ entries: zod.z.array(zod.z.object({
		name: zod.z.string(),
		isDirectory: zod.z.boolean(),
		size: zod.z.number()
	})) })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_fsRead = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string()
});
const res_fsRead = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ content: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_fsWrite = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string(),
	content: zod.z.string()
});
const res_fsWrite = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ path: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_fsCreateFile = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string()
});
const res_fsCreateFile = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ path: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_fsCreateDir = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string()
});
const res_fsCreateDir = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ path: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_fsRename = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string(),
	newName: zod.z.string()
});
const res_fsRename = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ path: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_fsDelete = zod.z.object({
	root: zod.z.string(),
	path: zod.z.string()
});
const res_fsDelete = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ path: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_gitStatus = zod.z.object({
	root: zod.z.string(),
	repoPath: zod.z.string()
});
const res_gitStatus = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({
		branch: zod.z.string(),
		dirtyCount: zod.z.number(),
		changes: zod.z.array(zod.z.object({
			path: zod.z.string(),
			status: zod.z.union([
				zod.z.literal("M"),
				zod.z.literal("A"),
				zod.z.literal("D"),
				zod.z.literal("U")
			])
		}))
	})
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_gitCheckout = zod.z.object({
	root: zod.z.string(),
	repoPath: zod.z.string(),
	branch: zod.z.string()
});
const res_gitCheckout = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ output: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_gitCreateBranch = zod.z.object({
	root: zod.z.string(),
	repoPath: zod.z.string(),
	name: zod.z.string()
});
const res_gitCreateBranch = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ output: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_gitPull = zod.z.object({
	root: zod.z.string(),
	repoPath: zod.z.string()
});
const res_gitPull = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ output: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_chat = zod.z.object({
	messages: zod.z.array(zod.z.object({
		role: zod.z.union([
			zod.z.literal("system"),
			zod.z.literal("user"),
			zod.z.literal("assistant")
		]),
		content: zod.z.string()
	})),
	model: zod.z.string(),
	apiBase: zod.z.string(),
	apiKey: zod.z.string()
});
const res_chat = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ content: zod.z.string() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_qqList = zod.z.object({});
const res_qqList = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ sessions: zod.z.array(zod.z.object({
		key: zod.z.string(),
		peerId: zod.z.string(),
		kind: zod.z.union([zod.z.literal("group"), zod.z.literal("c2c")]),
		messages: zod.z.array(zod.z.object({
			role: zod.z.union([zod.z.literal("user"), zod.z.literal("assistant")]),
			content: zod.z.string()
		})),
		updatedAt: zod.z.number()
	})) })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_qqRead = zod.z.object({ key: zod.z.string() });
const res_qqRead = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ session: zod.z.unknown().optional() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const req_qqSend = zod.z.object({
	key: zod.z.string(),
	content: zod.z.string()
});
const res_qqSend = zod.z.union([zod.z.object({
	ok: zod.z.literal(true),
	value: zod.z.object({ ok: zod.z.boolean() })
}), zod.z.object({
	ok: zod.z.literal(false),
	error: zod.z.object({
		code: zod.z.string(),
		message: zod.z.string()
	})
})]);
const TYPERT_REMOTE = {
	package: "dsh-shiningweb-ui",
	descriptors: [
		{
			id: "dsh-shiningweb-ui#shining/fsList",
			service: "shining",
			namespace: "shining",
			method: "fsList",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsListRequest",
					schema: req_fsList
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsListResult",
				schema: res_fsList
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsRead",
			service: "shining",
			namespace: "shining",
			method: "fsRead",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsReadRequest",
					schema: req_fsRead
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsReadResult",
				schema: res_fsRead
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsWrite",
			service: "shining",
			namespace: "shining",
			method: "fsWrite",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsWriteRequest",
					schema: req_fsWrite
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsWriteResult",
				schema: res_fsWrite
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsCreateFile",
			service: "shining",
			namespace: "shining",
			method: "fsCreateFile",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsCreateFileRequest",
					schema: req_fsCreateFile
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsCreateFileResult",
				schema: res_fsCreateFile
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsCreateDir",
			service: "shining",
			namespace: "shining",
			method: "fsCreateDir",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsCreateDirRequest",
					schema: req_fsCreateDir
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsCreateDirResult",
				schema: res_fsCreateDir
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsRename",
			service: "shining",
			namespace: "shining",
			method: "fsRename",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsRenameRequest",
					schema: req_fsRename
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsRenameResult",
				schema: res_fsRename
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/fsDelete",
			service: "shining",
			namespace: "shining",
			method: "fsDelete",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#fsDeleteRequest",
					schema: req_fsDelete
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#fsDeleteResult",
				schema: res_fsDelete
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitStatus",
			service: "shining",
			namespace: "shining",
			method: "gitStatus",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitStatusRequest",
					schema: req_gitStatus
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitStatusResult",
				schema: res_gitStatus
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitCheckout",
			service: "shining",
			namespace: "shining",
			method: "gitCheckout",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitCheckoutRequest",
					schema: req_gitCheckout
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitCheckoutResult",
				schema: res_gitCheckout
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitCreateBranch",
			service: "shining",
			namespace: "shining",
			method: "gitCreateBranch",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitCreateBranchRequest",
					schema: req_gitCreateBranch
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitCreateBranchResult",
				schema: res_gitCreateBranch
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/gitPull",
			service: "shining",
			namespace: "shining",
			method: "gitPull",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#gitPullRequest",
					schema: req_gitPull
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#gitPullResult",
				schema: res_gitPull
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/chat",
			service: "shining",
			namespace: "shining",
			method: "chat",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#chatRequest",
					schema: req_chat
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#chatResult",
				schema: res_chat
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/qqList",
			service: "shining",
			namespace: "shining",
			method: "qqList",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#qqListRequest",
					schema: req_qqList
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#qqListResult",
				schema: res_qqList
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/qqRead",
			service: "shining",
			namespace: "shining",
			method: "qqRead",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#qqReadRequest",
					schema: req_qqRead
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#qqReadResult",
				schema: res_qqRead
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		},
		{
			id: "dsh-shiningweb-ui#shining/qqSend",
			service: "shining",
			namespace: "shining",
			method: "qqSend",
			invocation: { kind: "direct" },
			parameters: [{
				name: "request",
				wire: "request",
				source: "json",
				codec: {
					mode: "strict",
					typeSymbol: "#qqSendRequest",
					schema: req_qqSend
				}
			}],
			result: {
				mode: "strict",
				typeSymbol: "#qqSendResult",
				schema: res_qqSend
			},
			sourceLocation: {
				file: "src/gateway.ts",
				line: 1,
				column: 1
			}
		}
	]
};
var remote_default = TYPERT_REMOTE;

//#endregion
//#region src/client/remote-types.ts
let shiningRemote;
/** apply 挂载 remote 后绑定实例。 */
function setShiningRemote(r) {
	shiningRemote = r;
}
/** 组件读取当前 remote 实例（apply 后即稳定）。 */
function getShiningRemote() {
	return shiningRemote;
}

//#endregion
//#region src/client/dsh-context.ts
let ctx;
const listeners$1 = new Set();
let cached = {
	workspaces: [],
	sessions: [],
	currentSessionId: void 0
};
let version = 0;
/** apply 时绑定 DSH 客户端上下文。 */
function bindDshCtx(c) {
	ctx = c;
}
function emit$1() {
	version += 1;
	cached = gatherDshContext();
	for (const l of listeners$1) l();
}
/** 订阅 workspaces + sessions 列表变化（供 useDshContext 响应式）。 */
function subscribe(l) {
	listeners$1.add(l);
	ctx?.workspaces.list.subscribe(emit$1);
	ctx?.sessions.list.subscribe(emit$1);
	return () => {
		listeners$1.delete(l);
	};
}
/** 同步聚合 DSH 概况（工作区/会话/当前会话）。 */
function gatherDshContext() {
	if (!ctx) return {
		workspaces: [],
		sessions: [],
		currentSessionId: void 0
	};
	const workspaces = ctx.workspaces.list.getSnapshot().items.map((w) => ({
		id: w.workspaceId,
		title: w.title,
		path: w.path
	}));
	const list = ctx.sessions.list.getSnapshot();
	const currentSessionId = list.current;
	const sessions = list.ids.map((id) => {
		const s$1 = list.byId[id];
		return {
			id,
			title: s$1?.displayTitle ?? String(id),
			cwd: s$1?.cwd
		};
	});
	return {
		workspaces,
		sessions,
		currentSessionId
	};
}
/** 响应式读 DSH 概况（快照缓存，仅在列表变化时重算）。 */
function useDshContext() {
	return (0, react.useSyncExternalStore)(subscribe, () => cached);
}
/** 把 DSH 概况格式化为 model 上下文块（注入独立模型 system prompt）。 */
function dshContextToText(c) {
	const lines = ["【DSH 主窗口概况】"];
	if (c.workspaces.length) lines.push(`项目：${c.workspaces.map((w) => w.title).join("、")}`);
	if (c.sessions.length) lines.push(`会话：${c.sessions.map((s$1) => s$1.title).join("、")}`);
	if (c.currentSessionId) {
		const cur = c.sessions.find((s$1) => s$1.id === c.currentSessionId);
		lines.push(`当前会话：${cur?.title ?? "（无标题）"}`);
	}
	if (c.workspaces.length || c.sessions.length) return lines.join("\n");
	return "";
}
/**
* 代发：把一段内容作为"一轮"送进指定 DSH 会话（主 agent 处理）。
* @param sessionId - 目标会话。
* @param text - 任务内容。
*/
async function sendToSession(sessionId, text) {
	const binding = ctx?.sessions.binding(sessionId);
	if (!binding) return false;
	const res = await binding.session.prompt([{
		type: "text",
		text
	}], "queue");
	return res.ok === true;
}
/** 当前会话 id（异步绑定场景兜底）。 */
function getCurrentSessionId() {
	return ctx?.sessions.list.getSnapshot().current;
}

//#endregion
//#region src/client/workspace.ts
/** 当前工作区根路径 + 打开文件回调（apply 订阅 workspaces 列表设置）。 */
let root = "";
let openPathFn;
function setWorkspaceRoot(r) {
	root = r;
}
function getWorkspaceRoot() {
	return root;
}
function setOpenPath(fn) {
	openPathFn = fn;
}
function getOpenPath() {
	return openPathFn;
}

//#endregion
//#region src/client/store.ts
let state = {
	chatOpen: false,
	filesOpen: false
};
const listeners = new Set();
function emit() {
	for (const l of listeners) l();
}
function set(next) {
	state = {
		...state,
		...next
	};
	emit();
}
function useShiningStore() {
	return (0, react.useSyncExternalStore)((l) => {
		listeners.add(l);
		return () => {
			listeners.delete(l);
		};
	}, () => state);
}
function openChat() {
	set({ chatOpen: true });
}
function closeChat() {
	set({ chatOpen: false });
}
function openFiles() {
	set({ filesOpen: true });
}
function closeFiles() {
	set({ filesOpen: false });
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\SidebarEntry.module.css.mjs
const css$6 = ".tSXlGa_entry{width:100%;color:var(--dsw-alias-label-primary);cursor:pointer;font:inherit;text-align:left;background:0 0;border:0;align-items:center;gap:8px;padding:6px 10px;display:flex}.tSXlGa_entry:hover{background:var(--dsw-alias-interactive-bg-hover)}.tSXlGa_icon{flex:none}.tSXlGa_label{font-size:13px}";
const tagId$6 = "dsh-shiningweb-ui/SidebarEntry.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$6) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$6;
	tag.textContent = css$6;
	document.head.appendChild(tag);
}
var SidebarEntry_module_css_default = {
	"entry": "tSXlGa_entry",
	"icon": "tSXlGa_icon",
	"label": "tSXlGa_label"
};

//#endregion
//#region src/client/components/SidebarEntry.tsx
/** 天圆地方入口按钮（拱门图标）。 */
function ChatEntry(props) {
	const settings = useSettings();
	if (!settings.enabled || !settings.chat.enabled) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: SidebarEntry_module_css_default.entry,
		onClick: openChat,
		"aria-label": dict.zh.entryChat,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("svg", {
			className: SidebarEntry_module_css_default.icon,
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			"aria-hidden": "true",
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M4 20h16M6 20V9a6 6 0 0 1 12 0v11",
				stroke: "currentColor",
				strokeWidth: "1.6"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M6 14h12",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})]
		}), props.wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: SidebarEntry_module_css_default.label,
			children: dict.zh.entryChat
		}) : null]
	});
}
/** 文件栏入口按钮。 */
function FilesEntry(props) {
	const settings = useSettings();
	if (!settings.enabled || !settings.fileExplorer.enabled) return null;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
		type: "button",
		className: SidebarEntry_module_css_default.entry,
		onClick: openFiles,
		"aria-label": dict.zh.entryFiles,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("svg", {
			className: SidebarEntry_module_css_default.icon,
			width: "16",
			height: "16",
			viewBox: "0 0 24 24",
			fill: "none",
			"aria-hidden": "true",
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsx)("path", {
				d: "M3 6h7l2 2h9v11H3z",
				stroke: "currentColor",
				strokeWidth: "1.6"
			})
		}), props.wide ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: SidebarEntry_module_css_default.label,
			children: dict.zh.entryFiles
		}) : null]
	});
}

//#endregion
//#region src/client/storage.ts
/**
* 本地存储：IndexedDB（聊天历史）+ localStorage（立绘/背景，限尺寸）。
*/
const DB = "shining-chat";
const STORE = "history";
function openDb$1() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(DB, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
/** 保存一次会话历史（按 id 覆盖）。 */
async function saveChat(rec) {
	const db = await openDb$1();
	const tx = db.transaction(STORE, "readwrite");
	tx.objectStore(STORE).put(rec);
	await new Promise((res, rej) => {
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}
/** 读取指定角色最近一次会话。 */
async function loadChat(personaId) {
	const db = await openDb$1();
	return new Promise((res, rej) => {
		const all = db.transaction(STORE).objectStore(STORE).getAll();
		all.onsuccess = () => {
			const list = all.result.filter((r) => r.personaId === personaId).sort((a, b) => b.updatedAt - a.updatedAt);
			res(list[0]);
		};
		all.onerror = () => rej(all.error);
	});
}
/** 立绘图片（Base64 DataURL）存取，限 2MB。 */
const IMG_KEY = "shining:image";
function setImage(dataUrl) {
	localStorage.setItem(IMG_KEY, dataUrl);
}
function getImage() {
	return localStorage.getItem(IMG_KEY);
}
function clearImage() {
	localStorage.removeItem(IMG_KEY);
}
/** 压缩图片到最大 1024px，JPEG 0.8，仍超 2MB 则拒绝。 */
async function compressImage(file) {
	const dataUrl = await readDataUrl(file);
	const img = await loadImage(dataUrl);
	const max = 1024;
	const scale = Math.min(1, max / Math.max(img.width, img.height));
	const canvas = document.createElement("canvas");
	canvas.width = Math.max(1, Math.round(img.width * scale));
	canvas.height = Math.max(1, Math.round(img.height * scale));
	const ctx$1 = canvas.getContext("2d");
	if (!ctx$1) throw new Error("canvas unavailable");
	ctx$1.drawImage(img, 0, 0, canvas.width, canvas.height);
	const out = canvas.toDataURL("image/jpeg", .8);
	if (out.length > 2 * 1024 * 1024) throw new Error("image too large (>2MB)");
	return out;
}
function readDataUrl(file) {
	return new Promise((res, rej) => {
		const r = new FileReader();
		r.onload = () => res(String(r.result));
		r.onerror = () => rej(r.error);
		r.readAsDataURL(file);
	});
}
function loadImage(src) {
	return new Promise((res, rej) => {
		const img = new Image();
		img.onload = () => res(img);
		img.onerror = () => rej(new Error("image load failed"));
		img.src = src;
	});
}
const MEM_DB = "shining-memory";
const MEM_STORE = "memory";
function openMemDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(MEM_DB, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(MEM_STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
/** 读取天圆地方自持记忆（倒序，最多 limit 条）。 */
async function listMemoryNotes(limit = 10) {
	const db = await openMemDb();
	return new Promise((res, rej) => {
		const rq = db.transaction(MEM_STORE).objectStore(MEM_STORE).getAll();
		rq.onsuccess = () => res(rq.result.sort((a, b) => b.createdAt - a.createdAt).slice(0, limit));
		rq.onerror = () => rej(rq.error);
	});
}

//#endregion
//#region src/client/hooks/useChat.ts
function useChat(personaId, remote, settings) {
	const [rec, setRec] = (0, react.useState)(null);
	const [busy, setBusy] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		let alive = true;
		loadChat(personaId).then((r) => {
			if (alive) setRec(r ?? null);
		});
		return () => {
			alive = false;
		};
	}, [personaId]);
	const send = (0, react.useCallback)(async (text, contextText) => {
		if (busy || !text.trim() || !remote) return;
		setBusy(true);
		try {
			const base = rec?.messages ?? [];
			const userMsg = {
				role: "user",
				content: text.trim()
			};
			const withUser = [...base, userMsg];
			const nextRec = {
				id: rec?.id ?? `${personaId}-${Date.now()}`,
				personaId,
				messages: withUser,
				updatedAt: Date.now()
			};
			await saveChat(nextRec);
			setRec(nextRec);
			const modelMessages = contextText ? [{
				role: "system",
				content: contextText
			}, ...withUser] : withUser;
			const res = await remote.chat({
				messages: modelMessages,
				model: settings.chat.model,
				apiBase: settings.chat.apiBase,
				apiKey: settings.chat.apiKey
			});
			const content = res.ok ? res.value.content : res.error?.message ?? "请求失败";
			const finalRec = {
				...nextRec,
				messages: [...withUser, {
					role: "assistant",
					content
				}],
				updatedAt: Date.now()
			};
			await saveChat(finalRec);
			setRec(finalRec);
		} finally {
			setBusy(false);
		}
	}, [
		busy,
		rec,
		remote,
		settings.chat,
		personaId
	]);
	return {
		rec,
		busy,
		send
	};
}

//#endregion
//#region src/client/friend-circle.ts
/** 天圆地方朋友圈：动态/点赞/评论（IndexedDB）。 */
const FC_DB = "shining-friend-circle";
const FC_STORE = "posts";
function openDb() {
	return new Promise((resolve, reject) => {
		const req = indexedDB.open(FC_DB, 1);
		req.onupgradeneeded = () => {
			req.result.createObjectStore(FC_STORE, { keyPath: "id" });
		};
		req.onsuccess = () => resolve(req.result);
		req.onerror = () => reject(req.error);
	});
}
/** 发布一条动态。 */
async function addPost(personaId, content) {
	const db = await openDb();
	const post = {
		id: `post-${Date.now()}`,
		personaId,
		content,
		createdAt: Date.now(),
		likes: [],
		comments: []
	};
	const tx = db.transaction(FC_STORE, "readwrite");
	tx.objectStore(FC_STORE).put(post);
	await new Promise((res, rej) => {
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}
/** 列出某角色的全部动态（倒序）。 */
async function listPosts(personaId) {
	const db = await openDb();
	return new Promise((res, rej) => {
		const rq = db.transaction(FC_STORE).objectStore(FC_STORE).getAll();
		rq.onsuccess = () => res(rq.result.filter((p) => p.personaId === personaId).sort((a, b) => b.createdAt - a.createdAt));
		rq.onerror = () => rej(rq.error);
	});
}
/** 点赞/取消点赞（toggle）。 */
async function toggleLike(postId, liker) {
	const db = await openDb();
	const rq = db.transaction(FC_STORE).objectStore(FC_STORE).get(postId);
	const post = await new Promise((res, rej) => {
		rq.onsuccess = () => res(rq.result);
		rq.onerror = () => rej(rq.error);
	});
	if (!post) return;
	const likes = post.likes.includes(liker) ? post.likes.filter((l) => l !== liker) : [...post.likes, liker];
	await putPost(db, {
		...post,
		likes
	});
}
async function putPost(db, post) {
	const tx = db.transaction(FC_STORE, "readwrite");
	tx.objectStore(FC_STORE).put(post);
	await new Promise((res, rej) => {
		tx.oncomplete = () => res();
		tx.onerror = () => rej(tx.error);
	});
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\FriendCircle.module.css.mjs
const css$5 = ".kCIwiW_wrap{flex-direction:column;flex:1;gap:12px;padding:16px;display:flex;overflow-y:auto}.kCIwiW_composer{gap:8px;display:flex}.kCIwiW_textarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-height:64px;color:var(--dsw-alias-label-primary);resize:vertical;border-radius:8px;flex:1;padding:8px}.kCIwiW_publish{background:var(--shining-primary);color:#fff;cursor:pointer;border:0;border-radius:8px;align-self:flex-start;padding:8px 16px}.kCIwiW_list{flex-direction:column;gap:12px;margin:0;padding:0;list-style:none;display:flex}.kCIwiW_post{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);border-radius:12px;padding:12px}.kCIwiW_content{margin:0 0 8px}.kCIwiW_meta{color:var(--dsw-alias-label-secondary);align-items:center;gap:8px;font-size:12px;display:flex}.kCIwiW_time{flex:1}.kCIwiW_action{cursor:pointer;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border:0}.kCIwiW_comments{flex-direction:column;gap:4px;margin:8px 0 0;padding:0;font-size:13px;list-style:none;display:flex}.kCIwiW_comment{color:var(--dsw-alias-label-secondary)}.kCIwiW_empty{color:var(--dsw-alias-label-secondary);font-size:13px}";
const tagId$5 = "dsh-shiningweb-ui/FriendCircle.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$5) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$5;
	tag.textContent = css$5;
	document.head.appendChild(tag);
}
var FriendCircle_module_css_default = {
	"action": "kCIwiW_action",
	"comment": "kCIwiW_comment",
	"comments": "kCIwiW_comments",
	"composer": "kCIwiW_composer",
	"content": "kCIwiW_content",
	"empty": "kCIwiW_empty",
	"list": "kCIwiW_list",
	"meta": "kCIwiW_meta",
	"post": "kCIwiW_post",
	"publish": "kCIwiW_publish",
	"textarea": "kCIwiW_textarea",
	"time": "kCIwiW_time",
	"wrap": "kCIwiW_wrap"
};

//#endregion
//#region src/client/components/FriendCircle.tsx
function FriendCircle(props) {
	const [posts, setPosts] = (0, react.useState)([]);
	const [draft, setDraft] = (0, react.useState)("");
	const refresh = () => {
		listPosts(props.personaId).then(setPosts);
	};
	(0, react.useEffect)(() => {
		refresh();
	}, [props.personaId]);
	const publish = async () => {
		if (!draft.trim()) return;
		await addPost(props.personaId, draft.trim());
		setDraft("");
		refresh();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: FriendCircle_module_css_default.wrap,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: FriendCircle_module_css_default.composer,
			children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
				className: FriendCircle_module_css_default.textarea,
				value: draft,
				onChange: (e) => setDraft(e.target.value),
				placeholder: "这一刻的想法…"
			}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: FriendCircle_module_css_default.publish,
				onClick: () => void publish(),
				disabled: !draft.trim(),
				children: "发表"
			})]
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
			className: FriendCircle_module_css_default.list,
			children: [posts.map((p) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
				className: FriendCircle_module_css_default.post,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
						className: FriendCircle_module_css_default.content,
						children: p.content
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: FriendCircle_module_css_default.meta,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: FriendCircle_module_css_default.time,
							children: new Date(p.createdAt).toLocaleString()
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
							className: FriendCircle_module_css_default.action,
							onClick: () => void toggleLike(p.id, "me").then(refresh),
							children: ["赞 ", p.likes.length]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: FriendCircle_module_css_default.comments,
						children: p.comments.map((c) => /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", {
							className: FriendCircle_module_css_default.comment,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("b", { children: [c.author, "："] }), c.content]
						}, c.id))
					})
				]
			}, p.id)), posts.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
				className: FriendCircle_module_css_default.empty,
				children: "还没有动态"
			}) : null]
		})]
	});
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\QqSessions.module.css.mjs
const css$4 = ".Aci1na_wrap{flex-direction:column;flex:1;gap:12px;padding:16px;display:flex;overflow-y:auto}.Aci1na_refresh{border:1px solid var(--dsw-alias-border-l2);cursor:pointer;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border-radius:6px;align-self:flex-start;padding:4px 12px}.Aci1na_list{flex-direction:column;gap:8px;margin:0;padding:0;list-style:none;display:flex}.Aci1na_session{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-module-platform);cursor:pointer;width:100%;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;border-radius:8px;gap:8px;padding:8px;display:flex}.Aci1na_peer{flex:none;font-weight:600}.Aci1na_preview{text-overflow:ellipsis;white-space:nowrap;color:var(--dsw-alias-label-secondary);flex:1;overflow:hidden}.Aci1na_detail{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;flex-direction:column;gap:8px;padding:12px;display:flex}.Aci1na_messages{flex-direction:column;gap:6px;max-height:40vh;margin:0;padding:0;list-style:none;display:flex;overflow-y:auto}.Aci1na_user{background:var(--shining-primary);color:#fff;border-radius:10px;align-self:flex-end;max-width:75%;padding:5px 10px}.Aci1na_assistant{background:var(--dsw-alias-bg-base);border-radius:10px;align-self:flex-start;max-width:75%;padding:5px 10px}.Aci1na_composer{gap:8px;display:flex}.Aci1na_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:6px;flex:1;padding:6px 10px}.Aci1na_send{background:var(--shining-primary);color:#fff;cursor:pointer;border:0;border-radius:6px;padding:6px 14px}.Aci1na_empty{color:var(--dsw-alias-label-secondary);font-size:13px}";
const tagId$4 = "dsh-shiningweb-ui/QqSessions.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$4) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$4;
	tag.textContent = css$4;
	document.head.appendChild(tag);
}
var QqSessions_module_css_default = {
	"assistant": "Aci1na_assistant",
	"composer": "Aci1na_composer",
	"detail": "Aci1na_detail",
	"empty": "Aci1na_empty",
	"input": "Aci1na_input",
	"list": "Aci1na_list",
	"messages": "Aci1na_messages",
	"peer": "Aci1na_peer",
	"preview": "Aci1na_preview",
	"refresh": "Aci1na_refresh",
	"send": "Aci1na_send",
	"session": "Aci1na_session",
	"user": "Aci1na_user",
	"wrap": "Aci1na_wrap"
};

//#endregion
//#region src/client/components/QqSessions.tsx
function QqSessions() {
	const [sessions, setSessions] = (0, react.useState)([]);
	const [open, setOpen] = (0, react.useState)(null);
	const [draft, setDraft] = (0, react.useState)("");
	const remote = getShiningRemote();
	const refresh = () => {
		remote?.qqList({}).then((r) => {
			if (r.ok) setSessions(r.value.sessions);
		});
	};
	(0, react.useEffect)(() => {
		refresh();
	}, []);
	const openSession = (s$1) => {
		if (remote) remote.qqRead({ key: s$1.key }).then((r) => {
			if (r.ok && r.value.session) setOpen(r.value.session);
		});
	};
	const reply = async () => {
		if (!open || !draft.trim() || !remote) return;
		await remote.qqSend({
			key: open.key,
			content: draft.trim()
		});
		setDraft("");
		refresh();
		remote.qqRead({ key: open.key }).then((r) => {
			if (r.ok && r.value.session) setOpen(r.value.session);
		});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: QqSessions_module_css_default.wrap,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: QqSessions_module_css_default.refresh,
				onClick: () => {
					refresh();
				},
				children: "刷新"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("ul", {
				className: QqSessions_module_css_default.list,
				children: [sessions.map((s$1) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
					className: QqSessions_module_css_default.session,
					onClick: () => openSession(s$1),
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: QqSessions_module_css_default.peer,
						children: s$1.kind === "group" ? `群 ${s$1.peerId}` : `私聊 ${s$1.peerId}`
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
						className: QqSessions_module_css_default.preview,
						children: s$1.messages[s$1.messages.length - 1]?.content?.slice(0, 30) ?? ""
					})]
				}) }, s$1.key)), sessions.length === 0 ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
					className: QqSessions_module_css_default.empty,
					children: "暂无 QQ 会话（需配置 QQ 并接收消息）"
				}) : null]
			}),
			open ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: QqSessions_module_css_default.detail,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
					className: QqSessions_module_css_default.messages,
					children: open.messages.map((m, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
						className: m.role === "user" ? QqSessions_module_css_default.user : QqSessions_module_css_default.assistant,
						children: m.content
					}, i))
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: QqSessions_module_css_default.composer,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						className: QqSessions_module_css_default.input,
						value: draft,
						onChange: (e) => setDraft(e.target.value),
						placeholder: "回复…",
						onKeyDown: (e) => {
							if (e.key === "Enter") reply();
						}
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: QqSessions_module_css_default.send,
						onClick: () => void reply(),
						disabled: !draft.trim(),
						children: "发送"
					})]
				})]
			}) : null
		]
	});
}

//#endregion
//#region src/client/memory.ts
/**
* 聚合记忆上下文（发起前调用）：读 dsh-mneme 相关记忆 + 天圆地方自持记忆。
* dsh-mneme 不可用时优雅降级为自持记忆。
* @param query - 用于 dsh-mneme 检索的关键词（通常为当前用户输入）。
*/
async function readMemoryContext(query) {
	const chunks = [];
	try {
		const res = await fetch(`/api/dsh-mneme/search?q=${encodeURIComponent(query)}&limit=5`);
		if (res.ok) {
			const data = await res.json();
			for (const it of data.items ?? []) {
				const content = it.content ?? "";
				if (content) chunks.push(`【记忆】${it.title ? `${it.title}：` : ""}${content}`);
			}
		}
	} catch {}
	for (const n of await listMemoryNotes(3)) chunks.push(`【天圆地方记忆】${n.content}`);
	return chunks.slice(0, 6).join("\n");
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\ChatWindow.module.css.mjs
const css$3 = ".jtKunW_overlay{z-index:1000;pointer-events:auto;justify-content:center;align-items:center;display:flex;position:fixed;inset:0}.jtKunW_backdrop{background:#0006;position:absolute;inset:0}.jtKunW_panel{border:1px solid var(--dsw-alias-border-l2);background-color:var(--dsw-alias-bg-overlay);background-position:50%;background-size:cover;border-radius:16px;flex-direction:column;width:min(720px,92vw);height:min(560px,86vh);display:flex;position:relative;overflow:hidden}.jtKunW_header{border-bottom:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-bg-overlay) 80%, transparent);justify-content:space-between;align-items:center;padding:14px 16px;display:flex}.jtKunW_title{margin:0;font-size:16px}.jtKunW_tag{color:var(--dsw-alias-label-secondary);margin-left:8px;font-size:12px}.jtKunW_upload{color:var(--dsw-alias-label-secondary);cursor:pointer;margin-left:auto;margin-right:8px;font-size:12px}.jtKunW_close{cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:0;margin-left:8px;font-size:18px}.jtKunW_messages{flex-direction:column;flex:1;gap:8px;margin:0;padding:16px;list-style:none;display:flex;overflow-y:auto}.jtKunW_user{background:var(--shining-primary);color:#fff;border-radius:12px;align-self:flex-end;max-width:70%;padding:6px 12px}.jtKunW_assistant{background:var(--dsw-alias-bg-module-platform);border-radius:12px;align-self:flex-start;max-width:70%;padding:6px 12px}.jtKunW_footer{border-top:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-bg-overlay) 80%, transparent);gap:8px;padding:12px 16px;display:flex}.jtKunW_input{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:8px;flex:1;padding:8px 12px}.jtKunW_send{background:var(--shining-primary);color:#fff;cursor:pointer;border:0;border-radius:8px;padding:8px 16px}.jtKunW_tabs{border-bottom:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-bg-overlay) 80%, transparent);gap:8px;padding:8px 16px;display:flex}.jtKunW_tab{cursor:pointer;color:var(--dsw-alias-label-secondary);font:inherit;background:0 0;border:0;padding:6px 12px}.jtKunW_tabActive{cursor:pointer;color:var(--shining-primary);font:inherit;border:0;border-bottom:2px solid var(--shining-primary);background:0 0;padding:6px 12px;font-weight:600}.jtKunW_delegate{border:1px solid var(--dsw-alias-border-l2);cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border-radius:8px;padding:8px 12px}.jtKunW_confirm{z-index:1001;background:#0006;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}.jtKunW_confirmBox{background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);border-radius:12px;width:min(360px,80vw);padding:16px}.jtKunW_confirmActions{justify-content:flex-end;gap:8px;margin-top:12px;display:flex}.jtKunW_confirmActions button{border:1px solid var(--dsw-alias-border-l2);cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border-radius:6px;padding:6px 12px}";
const tagId$3 = "dsh-shiningweb-ui/ChatWindow.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$3) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$3;
	tag.textContent = css$3;
	document.head.appendChild(tag);
}
var ChatWindow_module_css_default = {
	"assistant": "jtKunW_assistant",
	"backdrop": "jtKunW_backdrop",
	"close": "jtKunW_close",
	"confirm": "jtKunW_confirm",
	"confirmActions": "jtKunW_confirmActions",
	"confirmBox": "jtKunW_confirmBox",
	"delegate": "jtKunW_delegate",
	"footer": "jtKunW_footer",
	"header": "jtKunW_header",
	"input": "jtKunW_input",
	"messages": "jtKunW_messages",
	"overlay": "jtKunW_overlay",
	"panel": "jtKunW_panel",
	"send": "jtKunW_send",
	"tab": "jtKunW_tab",
	"tabActive": "jtKunW_tabActive",
	"tabs": "jtKunW_tabs",
	"tag": "jtKunW_tag",
	"title": "jtKunW_title",
	"upload": "jtKunW_upload",
	"user": "jtKunW_user"
};

//#endregion
//#region src/client/components/ChatWindow.tsx
const MODE_LABEL = {
	pet: "萌宠",
	assistant: "助理",
	super: "超级助理"
};
function ChatWindow(_props) {
	const { chatOpen } = useShiningStore();
	const settings = useSettings();
	const [tab, setTab] = (0, react.useState)("chat");
	const [input, setInput] = (0, react.useState)("");
	const [confirmSend, setConfirmSend] = (0, react.useState)(false);
	const dshContext = useDshContext();
	const { rec, busy, send } = useChat(settings.chat.personaId || "default", getShiningRemote(), settings);
	if (!chatOpen || !settings.enabled || !settings.chat.enabled) return null;
	const mode = settings.capabilityMode;
	const canDelegate = mode !== "pet" && getCurrentSessionId() !== void 0;
	const contextText = mode === "pet" ? void 0 : dshContextToText(dshContext);
	const onImage = async (file) => {
		if (!file) return;
		try {
			setImage(await compressImage(file));
		} catch {}
	};
	const backgroundImage = getImage();
	const doSend = async () => {
		const mem = await readMemoryContext(input);
		const combined = [contextText, mem].filter(Boolean).join("\n");
		await send(input, combined);
	};
	const doDelegate = () => {
		const cur = getCurrentSessionId();
		if (!cur || !input.trim()) return;
		if (mode === "assistant") {
			setConfirmSend(true);
			return;
		}
		sendToSession(cur, input.trim());
		setInput("");
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: ChatWindow_module_css_default.overlay,
		role: "dialog",
		"aria-modal": "true",
		"aria-label": dict.zh.chatTitle,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: ChatWindow_module_css_default.backdrop,
				onClick: closeChat
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: ChatWindow_module_css_default.panel,
				style: {
					backdropFilter: `blur(var(--shining-blur))`,
					backgroundImage: backgroundImage ? `url(${backgroundImage})` : void 0
				},
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
						className: ChatWindow_module_css_default.header,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", {
								className: ChatWindow_module_css_default.title,
								children: dict.zh.chatTitle
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
								className: ChatWindow_module_css_default.tag,
								children: [
									"人格：",
									settings.chat.personaId || "默认",
									" · ",
									MODE_LABEL[mode] ?? mode
								]
							})] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
								className: ChatWindow_module_css_default.upload,
								children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
									type: "file",
									accept: "image/*",
									hidden: true,
									onChange: (e) => void onImage(e.target.files?.[0])
								}), "更换立绘"]
							}),
							backgroundImage ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.close,
								onClick: clearImage,
								"aria-label": "clear image",
								children: "清除立绘"
							}) : null,
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.close,
								onClick: closeChat,
								"aria-label": dict.zh.close,
								children: "×"
							})
						]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("nav", {
						className: ChatWindow_module_css_default.tabs,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: tab === "chat" ? ChatWindow_module_css_default.tabActive : ChatWindow_module_css_default.tab,
								onClick: () => setTab("chat"),
								children: "聊天"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: tab === "circle" ? ChatWindow_module_css_default.tabActive : ChatWindow_module_css_default.tab,
								onClick: () => setTab("circle"),
								children: "朋友圈"
							}),
							mode === "super" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: tab === "qq" ? ChatWindow_module_css_default.tabActive : ChatWindow_module_css_default.tab,
								onClick: () => setTab("qq"),
								children: "QQ 会话"
							}) : null
						]
					}),
					tab === "chat" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)(react_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
						className: ChatWindow_module_css_default.messages,
						children: (rec?.messages ?? []).map((m, i) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("li", {
							className: m.role === "user" ? ChatWindow_module_css_default.user : ChatWindow_module_css_default.assistant,
							children: m.content
						}, i))
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("footer", {
						className: ChatWindow_module_css_default.footer,
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
								className: ChatWindow_module_css_default.input,
								value: input,
								onChange: (e) => setInput(e.target.value),
								placeholder: dict.zh.sendPlaceholder,
								onKeyDown: (e) => {
									if (e.key === "Enter") doSend();
								}
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.send,
								onClick: doSend,
								disabled: busy,
								children: dict.zh.send
							}),
							canDelegate ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								className: ChatWindow_module_css_default.delegate,
								onClick: doDelegate,
								disabled: busy,
								children: "委派到 DSH"
							}) : null
						]
					})] }) : tab === "circle" ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(FriendCircle, { personaId: settings.chat.personaId || "default" }) : /* @__PURE__ */ (0, react_jsx_runtime.jsx)(QqSessions, {})
				]
			}),
			confirmSend ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
				className: ChatWindow_module_css_default.confirm,
				children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: ChatWindow_module_css_default.confirmBox,
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "将这条任务发送给当前 DSH 会话？" }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: false,
							readOnly: true
						}), " 本次会话不再提示"] }),
						/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
							className: ChatWindow_module_css_default.confirmActions,
							children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => {
									setConfirmSend(false);
									sendToSession(getCurrentSessionId(), input.trim());
									setInput("");
								},
								children: "确认"
							}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
								onClick: () => setConfirmSend(false),
								children: "取消"
							})]
						})
					]
				})
			}) : null
		]
	});
}

//#endregion
//#region src/client/hooks/useFileTree.ts
function useFileTree(root$1, showHidden, remote) {
	const [children, setChildren] = (0, react.useState)({});
	const [expanded, setExpanded] = (0, react.useState)({});
	const toggle = (0, react.useCallback)(async (relPath) => {
		const next = !expanded[relPath];
		setExpanded((e) => ({
			...e,
			[relPath]: next
		}));
		if (next && !children[relPath] && remote) {
			const res = await remote.fsList({
				root: root$1,
				path: relPath || ".",
				showHidden
			});
			if (res.ok) setChildren((c) => ({
				...c,
				[relPath]: res.value.entries
			}));
		}
	}, [
		root$1,
		showHidden,
		expanded,
		children,
		remote
	]);
	const refresh = (0, react.useCallback)(async () => {
		setChildren({});
		setExpanded({});
	}, []);
	return {
		children,
		expanded,
		toggle,
		refresh
	};
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\FileExplorer.module.css.mjs
const css$2 = "._4O1cOG_drawer{z-index:999;border-right:1px solid var(--dsw-alias-border-l2);background:color-mix(in srgb, var(--dsw-alias-bg-overlay) 92%, transparent);width:min(360px,70vw);backdrop-filter:blur(var(--shining-blur));pointer-events:auto;flex-direction:column;display:flex;position:fixed;top:0;bottom:0;left:0}._4O1cOG_header{border-bottom:1px solid var(--dsw-alias-border-l2);justify-content:space-between;align-items:center;padding:12px 16px;display:flex}._4O1cOG_title{font-size:14px;font-weight:600}._4O1cOG_close{cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border:0;font-size:18px}._4O1cOG_search{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:6px;margin:8px 12px;padding:6px 10px}._4O1cOG_tree{flex:1;margin:0;padding:0 8px;list-style:none;overflow-y:auto}._4O1cOG_children{margin:0;padding-left:16px;list-style:none}._4O1cOG_row{cursor:pointer;width:100%;color:var(--dsw-alias-label-primary);font:inherit;text-align:left;background:0 0;border:0;align-items:center;gap:6px;padding:4px 8px;display:flex}._4O1cOG_row:hover{background:var(--dsw-alias-interactive-bg-hover)}._4O1cOG_icon{text-align:center;width:16px;color:var(--dsw-alias-label-secondary);flex:none;font-size:11px}._4O1cOG_name{text-overflow:ellipsis;white-space:nowrap;flex:1;font-size:13px;overflow:hidden}._4O1cOG_menu{z-index:1001;background:var(--dsw-alias-bg-module-platform);border:1px solid var(--dsw-alias-border-l2);border-radius:6px;flex-direction:column;min-width:120px;padding:4px;display:flex;position:fixed}._4O1cOG_menu button{cursor:pointer;text-align:left;color:var(--dsw-alias-label-primary);font:inherit;background:0 0;border:0;padding:6px 12px}._4O1cOG_menu button:hover{background:var(--dsw-alias-interactive-bg-hover)}";
const tagId$2 = "dsh-shiningweb-ui/FileExplorer.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$2) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$2;
	tag.textContent = css$2;
	document.head.appendChild(tag);
}
var FileExplorer_module_css_default = {
	"children": "_4O1cOG_children",
	"close": "_4O1cOG_close",
	"drawer": "_4O1cOG_drawer",
	"header": "_4O1cOG_header",
	"icon": "_4O1cOG_icon",
	"menu": "_4O1cOG_menu",
	"name": "_4O1cOG_name",
	"row": "_4O1cOG_row",
	"search": "_4O1cOG_search",
	"title": "_4O1cOG_title",
	"tree": "_4O1cOG_tree"
};

//#endregion
//#region src/client/components/FileExplorer.tsx
function extIcon(name) {
	const ext = name.split(".").pop()?.toLowerCase() ?? "";
	const map = {
		js: "JS",
		ts: "TS",
		py: "PY",
		json: "{}",
		md: "M",
		txt: "T",
		html: "<>"
	};
	return map[ext] ?? "•";
}
function FileExplorer(_props) {
	const { filesOpen } = useShiningStore();
	const settings = useSettings();
	const [query, setQuery] = (0, react.useState)("");
	const [menu, setMenu] = (0, react.useState)(null);
	const remote = getShiningRemote();
	const root$1 = getWorkspaceRoot();
	const openPath = getOpenPath();
	const tree = useFileTree(root$1, settings.fileExplorer.showHidden, remote);
	if (!filesOpen || !settings.enabled || !settings.fileExplorer.enabled) return null;
	const filtered = (entries) => (entries ?? []).filter((e) => !query || e.name.toLowerCase().includes(query.toLowerCase()));
	const renderDir = (rel) => {
		const children = filtered(tree.children[rel]);
		return children.map((e) => {
			const childRel = rel ? `${rel}/${e.name}` : e.name;
			return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("li", { children: [/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("button", {
				type: "button",
				className: FileExplorer_module_css_default.row,
				onContextMenu: (ev) => {
					ev.preventDefault();
					setMenu({
						x: ev.clientX,
						y: ev.clientY,
						path: childRel
					});
				},
				onClick: () => {
					if (e.isDirectory) tree.toggle(childRel);
					else openPath?.(childRel);
				},
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: FileExplorer_module_css_default.icon,
					children: e.isDirectory ? "▸" : extIcon(e.name)
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: FileExplorer_module_css_default.name,
					children: e.name
				})]
			}), e.isDirectory && tree.expanded[childRel] ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: FileExplorer_module_css_default.children,
				children: renderDir(childRel)
			}) : null] }, childRel);
		});
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: FileExplorer_module_css_default.drawer,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("header", {
				className: FileExplorer_module_css_default.header,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
					className: FileExplorer_module_css_default.title,
					children: dict.zh.entryFiles
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: FileExplorer_module_css_default.close,
					onClick: closeFiles,
					"aria-label": dict.zh.close,
					children: "×"
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				className: FileExplorer_module_css_default.search,
				value: query,
				onChange: (e) => setQuery(e.target.value),
				placeholder: dict.zh.fileFilter
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("ul", {
				className: FileExplorer_module_css_default.tree,
				children: renderDir("")
			}),
			menu ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)(CtxMenu, {
				menu,
				onClose: () => setMenu(null),
				remote,
				root: root$1,
				onDone: () => void tree.refresh()
			}) : null
		]
	});
}
function CtxMenu(props) {
	const run = async (op) => {
		await op();
		props.onClose();
		props.onDone();
	};
	const copy = () => {
		navigator.clipboard.writeText(props.menu.path);
		props.onClose();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: FileExplorer_module_css_default.menu,
		style: {
			left: props.menu.x,
			top: props.menu.y
		},
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsCreateFile({
					root: props.root,
					path: props.menu.path
				})),
				children: dict.zh.newFile
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsCreateDir({
					root: props.root,
					path: props.menu.path
				})),
				children: dict.zh.newDir
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsRename({
					root: props.root,
					path: props.menu.path,
					newName: "renamed"
				})),
				children: dict.zh.rename
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: () => void run(() => props.remote.fsDelete({
					root: props.root,
					path: props.menu.path
				})),
				children: dict.zh.remove
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				onClick: copy,
				children: dict.zh.copyPath
			})
		]
	});
}

//#endregion
//#region src/client/hooks/useGitBranch.ts
function useGitBranch(root$1, remote) {
	const [state$1, setState] = (0, react.useState)({
		branch: "",
		dirtyCount: 0,
		changes: []
	});
	const refresh = (0, react.useCallback)(async () => {
		if (!remote) return;
		const res = await remote.gitStatus({
			root: root$1,
			repoPath: "."
		});
		if (res.ok) setState(res.value);
	}, [root$1, remote]);
	return {
		state: state$1,
		refresh
	};
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\GitManager.module.css.mjs
const css$1 = ".-\\33 ZkfG_bar{color:var(--dsw-alias-label-secondary);align-items:center;gap:6px;padding:4px 8px;font-size:12px;display:flex}.-\\33 ZkfG_select{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);color:var(--dsw-alias-label-primary);border-radius:5px;padding:3px 6px}.-\\33 ZkfG_new{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);width:90px;color:var(--dsw-alias-label-primary);border-radius:5px;padding:3px 6px}.-\\33 ZkfG_btn{border:1px solid var(--dsw-alias-border-l2);cursor:pointer;color:var(--dsw-alias-label-primary);background:0 0;border-radius:5px;padding:3px 8px}.-\\33 ZkfG_dirty{margin-left:auto}";
const tagId$1 = "dsh-shiningweb-ui/GitManager.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId$1) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId$1;
	tag.textContent = css$1;
	document.head.appendChild(tag);
}
var GitManager_module_css_default = {
	"bar": "-3ZkfG_bar",
	"btn": "-3ZkfG_btn",
	"dirty": "-3ZkfG_dirty",
	"new": "-3ZkfG_new",
	"select": "-3ZkfG_select"
};

//#endregion
//#region src/client/components/GitManager.tsx
const REFRESH_MS = {
	"10s": 1e4,
	"30s": 3e4,
	"1m": 6e4
};
function GitManager(_props) {
	const settings = useSettings();
	const remote = getShiningRemote();
	const root$1 = getWorkspaceRoot();
	const git = useGitBranch(root$1, remote);
	const [branches, setBranches] = (0, react.useState)([]);
	const [newBranch, setNewBranch] = (0, react.useState)("");
	const [busy, setBusy] = (0, react.useState)(false);
	(0, react.useEffect)(() => {
		if (!settings.enabled || !settings.git.enabled || !root$1 || !remote) return;
		let alive = true;
		const refresh = async () => {
			const res = await remote.gitStatus({
				root: root$1,
				repoPath: "."
			});
			if (alive && res.ok) {
				git.refresh();
				setBranches([res.value.branch]);
			}
		};
		refresh();
		const interval = REFRESH_MS[settings.git.autoRefresh];
		if (interval) {
			const t = setInterval(() => void refresh(), interval);
			return () => {
				alive = false;
				clearInterval(t);
			};
		}
		return () => {
			alive = false;
		};
	}, [
		settings.enabled,
		settings.git.enabled,
		settings.git.autoRefresh,
		root$1,
		remote
	]);
	if (!settings.enabled || !settings.git.enabled) return null;
	const doCheckout = async (branch) => {
		if (!remote || branch === git.state.branch) return;
		setBusy(true);
		await remote.gitCheckout({
			root: root$1,
			repoPath: ".",
			branch
		});
		setBusy(false);
		await git.refresh();
	};
	const doCreate = async () => {
		if (!remote || !newBranch.trim()) return;
		setBusy(true);
		await remote.gitCreateBranch({
			root: root$1,
			repoPath: ".",
			name: newBranch.trim()
		});
		setNewBranch("");
		setBusy(false);
		await git.refresh();
	};
	const doPull = async () => {
		if (!remote) return;
		setBusy(true);
		await remote.gitPull({
			root: root$1,
			repoPath: "."
		});
		setBusy(false);
		await git.refresh();
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: GitManager_module_css_default.bar,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
				className: GitManager_module_css_default.select,
				value: git.state.branch,
				onChange: (e) => void doCheckout(e.target.value),
				disabled: busy,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: git.state.branch,
					children: git.state.branch || "无分支"
				}), branches.map((b) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
					value: b,
					children: b
				}, b))]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
				className: GitManager_module_css_default.new,
				value: newBranch,
				onChange: (e) => setNewBranch(e.target.value),
				placeholder: "新分支名"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: GitManager_module_css_default.btn,
				onClick: () => void doCreate(),
				disabled: busy,
				children: "+"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
				className: GitManager_module_css_default.btn,
				onClick: () => void doPull(),
				disabled: busy,
				children: "pull"
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("span", {
				className: GitManager_module_css_default.dirty,
				children: [
					dict.zh.dirtyCount,
					" ",
					git.state.dirtyCount
				]
			})
		]
	});
}

//#endregion
//#region \0dsh-css:F:\余程安学习资料\dsh-shiningweb-ui\src\client\components\SettingsPanel.module.css.mjs
const css = ".OkWOBG_group{flex-direction:column;gap:16px;padding:16px 0;display:flex}.OkWOBG_title{margin:0 0 4px;font-size:18px}.OkWOBG_section{border-bottom:1px solid var(--dsw-alias-border-l2);flex-direction:column;gap:6px;padding:8px 0;display:flex}.OkWOBG_sub{margin:0 0 4px;font-size:14px}.OkWOBG_row{color:var(--dsw-alias-label-primary);align-items:center;gap:8px;margin:4px 0;display:flex}.OkWOBG_label{min-width:90px}.OkWOBG_link{cursor:pointer;color:var(--dsw-alias-state-warn-primary);font:inherit;background:0 0;border:0;align-self:flex-start}.OkWOBG_longTextarea{border:1px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-base);min-height:72px;color:var(--dsw-alias-label-primary);resize:vertical;border-radius:6px;flex:1;padding:6px 8px}";
const tagId = "dsh-shiningweb-ui/SettingsPanel.module.css";
if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(tagId) + "]") === null) {
	const tag = document.createElement("style");
	tag.dataset.plugin = "dsh-shiningweb-ui";
	tag.dataset.pluginCss = tagId;
	tag.textContent = css;
	document.head.appendChild(tag);
}
var SettingsPanel_module_css_default = {
	"group": "OkWOBG_group",
	"label": "OkWOBG_label",
	"link": "OkWOBG_link",
	"longTextarea": "OkWOBG_longTextarea",
	"row": "OkWOBG_row",
	"section": "OkWOBG_section",
	"sub": "OkWOBG_sub",
	"title": "OkWOBG_title"
};

//#endregion
//#region src/client/components/SettingsPanel.tsx
function SettingsPanel(_props) {
	const settings = useSettings();
	const patch = async (key, value) => {
		await writeSetting(String(key), value);
	};
	const onImage = async (file) => {
		if (!file) return;
		try {
			setImage(await compressImage(file));
		} catch {}
	};
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
		className: SettingsPanel_module_css_default.group,
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", {
				className: SettingsPanel_module_css_default.title,
				children: dict.zh.settingsTitle
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
				label: "启用璀璨星河",
				checked: settings.enabled,
				onChange: (v) => void patch("enabled", v)
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
					className: SettingsPanel_module_css_default.sub,
					children: "能力模式"
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: SettingsPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "模式" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
						value: settings.capabilityMode,
						onChange: (e) => void patch("capabilityMode", e.target.value),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "pet",
								children: "萌宠（仅聊天+记忆+立绘）"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "assistant",
								children: "助理（可读主对话+代发需确认）"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "super",
								children: "超级助理（可调 Agent+QQ 接入）"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
						label: "天圆地方",
						checked: settings.chat.enabled,
						onChange: (v) => void patch("chat", {
							...settings.chat,
							enabled: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "模型",
						value: settings.chat.model,
						onChange: (v) => void patch("chat", {
							...settings.chat,
							model: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "API Base",
						value: settings.chat.apiBase,
						onChange: (v) => void patch("chat", {
							...settings.chat,
							apiBase: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "API Key",
						value: settings.chat.apiKey,
						type: "password",
						onChange: (v) => void patch("chat", {
							...settings.chat,
							apiKey: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "file",
							accept: "image/*",
							onChange: (e) => void onImage(e.target.files?.[0])
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "更换立绘" })]
					}),
					getImage() ? /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						className: SettingsPanel_module_css_default.link,
						onClick: clearImage,
						children: "清除立绘"
					}) : null
				]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
					label: "文件栏",
					checked: settings.fileExplorer.enabled,
					onChange: (v) => void patch("fileExplorer", {
						...settings.fileExplorer,
						enabled: v
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
					label: "显示隐藏文件",
					checked: settings.fileExplorer.showHidden,
					onChange: (v) => void patch("fileExplorer", {
						...settings.fileExplorer,
						showHidden: v
					})
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
					label: "Git 分支管理",
					checked: settings.git.enabled,
					onChange: (v) => void patch("git", {
						...settings.git,
						enabled: v
					})
				}), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
					className: SettingsPanel_module_css_default.row,
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "自动刷新" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
						value: settings.git.autoRefresh,
						onChange: (e) => void patch("git", {
							...settings.git,
							autoRefresh: e.target.value
						}),
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "off",
								children: "关闭"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "10s",
								children: "10s"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "30s",
								children: "30s"
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
								value: "1m",
								children: "1m"
							})
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: SettingsPanel_module_css_default.sub,
						children: "视觉主题"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "主色调" }), /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
							value: settings.visual.themeColor,
							onChange: (e) => void patch("visual", {
								...settings.visual,
								themeColor: e.target.value
							}),
							children: [
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "galaxy-blue",
									children: "星河蓝"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "dawn-gold",
									children: "晨曦金"
								}),
								/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
									value: "aurora-purple",
									children: "极光紫"
								})
							]
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: "毛玻璃强度" }), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							type: "range",
							min: 0,
							max: 24,
							value: settings.visual.glassBlur,
							onChange: (e) => void patch("visual", {
								...settings.visual,
								glassBlur: Number(e.target.value)
							})
						})]
					})
				]
			}),
			settings.capabilityMode === "super" ? /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
				className: SettingsPanel_module_css_default.section,
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h4", {
						className: SettingsPanel_module_css_default.sub,
						children: "QQ 群接入"
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Toggle, {
						label: "启用 QQ Bot",
						checked: settings.qq.enabled,
						onChange: (v) => void patch("qq", {
							...settings.qq,
							enabled: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "AppID",
						value: settings.qq.appId,
						onChange: (v) => void patch("qq", {
							...settings.qq,
							appId: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)(Row, {
						label: "AppSecret",
						value: settings.qq.appSecret,
						type: "password",
						onChange: (v) => void patch("qq", {
							...settings.qq,
							appSecret: v
						})
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SettingsPanel_module_css_default.label,
							children: "群号白名单"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
							value: settings.qq.groupAllow.join(", "),
							onChange: (e) => void patch("qq", {
								...settings.qq,
								groupAllow: e.target.value.split(",").map((s$1) => s$1.trim()).filter(Boolean)
							})
						})]
					}),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
						className: SettingsPanel_module_css_default.row,
						children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
							className: SettingsPanel_module_css_default.label,
							children: "QQ 人格提示词"
						}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("textarea", {
							className: SettingsPanel_module_css_default.longTextarea,
							value: settings.qq.personaPrompt,
							onChange: (e) => void patch("qq", {
								...settings.qq,
								personaPrompt: e.target.value
							})
						})]
					})
				]
			}) : null
		]
	});
}
function Toggle(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
		className: SettingsPanel_module_css_default.row,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
			type: "checkbox",
			checked: props.checked,
			onChange: (e) => props.onChange(e.target.checked)
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: props.label })]
	});
}
function Row(props) {
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", {
		className: SettingsPanel_module_css_default.row,
		children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", {
			className: SettingsPanel_module_css_default.label,
			children: props.label
		}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
			type: props.type ?? "text",
			value: props.value,
			onChange: (e) => props.onChange(e.target.value)
		})]
	});
}

//#endregion
//#region src/client/index.ts
/** Required services。不注入 'remote.shining'（我们自己在 apply 里挂载，声明为依赖会死锁）。 */
const inject = [
	"slots",
	"remote",
	"locale",
	"settingsScope",
	"connection"
];
/** Client plugin body。 */
async function apply(ctx$1) {
	ctx$1.effect(() => ctx$1.locale.register(NS, dict), "shining: dictionaries");
	await ctx$1.remote.$mount(remote_default);
	setShiningRemote(ctx$1.remote.shining);
	bindDshCtx(ctx$1);
	const scope$1 = ctx$1.settingsScope.bind({ namespace: SETTINGS_NAMESPACE });
	bindSettingsScope(scope$1);
	ctx$1.effect(() => scope$1.subscribe(() => applyVisual(scope$1.getSnapshot().value)), "shining: visual subscription");
	applyVisual(scope$1.getSnapshot().value);
	const syncRoot = () => setWorkspaceRoot(ctx$1.workspaces.list.getSnapshot().items[0]?.path ?? "");
	syncRoot();
	ctx$1.effect(() => ctx$1.workspaces.list.subscribe(syncRoot), "shining: workspace root");
	setOpenPath((path) => void ctx$1.workspaces.openPath(path));
	ctx$1.slots.inject("sidebar.footer.action", () => ctx$1.slots.register({
		name: "sidebar.footer.action",
		id: "shining-chat",
		order: 30,
		locale: NS
	}, ChatEntry));
	ctx$1.slots.inject("sidebar.footer.action", () => ctx$1.slots.register({
		name: "sidebar.footer.action",
		id: "shining-files",
		order: 31,
		locale: NS
	}, FilesEntry));
	ctx$1.slots.inject("shell.overlay", () => ctx$1.slots.register({
		name: "shell.overlay",
		id: "shining-chat"
	}, ChatWindow));
	ctx$1.slots.inject("shell.overlay", () => ctx$1.slots.register({
		name: "shell.overlay",
		id: "shining-files"
	}, FileExplorer));
	ctx$1.slots.inject("conversation.input.dock", () => ctx$1.slots.register({
		name: "conversation.input.dock",
		id: "shining-git"
	}, GitManager));
	ctx$1.slots.inject("settings.section", () => ctx$1.slots.register({
		name: "settings.section",
		id: "shining",
		order: 20,
		locale: NS
	}, SettingsPanel));
}

//#endregion
exports.apply = apply
exports.inject = inject
return module.exports; } });
//# sourceMappingURL=client.js.map