/**
 * typert 制品单一数据源：每个 Remote 方法的 request/result zod 源码字符串。
 * gen-typert.mjs 据此生成 host `./typert` 与 client remote 贡献。
 * 注意：schema 以源码字符串给出（zod 对象不能 JSON 序列化），生成器把字符串直接写入产物。
 */
export const NAMESPACE = 'shining'
export const PACKAGE = 'dsh-shiningweb-ui'

/** 构建 ShiningResult 联合的 zod 源码字符串。 */
const shiningResult = (valueSchema) =>
  `z.union([z.object({ ok: z.literal(true), value: ${valueSchema} }), z.object({ ok: z.literal(false), error: z.object({ code: z.string(), message: z.string() }) })])`

const rootPath = 'z.object({ root: z.string(), path: z.string() })'
const rootRepo = 'z.object({ root: z.string(), repoPath: z.string() })'

/** 每个 method 的 request/result schema 源码字符串。 */
export const methods = [
  { method: 'fsList', request: 'z.object({ root: z.string(), path: z.string(), showHidden: z.boolean().optional() })', result: shiningResult('z.object({ entries: z.array(z.object({ name: z.string(), isDirectory: z.boolean(), size: z.number() })) })') },
  { method: 'fsRead', request: rootPath, result: shiningResult('z.object({ content: z.string() })') },
  { method: 'fsWrite', request: 'z.object({ root: z.string(), path: z.string(), content: z.string() })', result: shiningResult('z.object({ path: z.string() })') },
  { method: 'fsCreateFile', request: rootPath, result: shiningResult('z.object({ path: z.string() })') },
  { method: 'fsCreateDir', request: rootPath, result: shiningResult('z.object({ path: z.string() })') },
  { method: 'fsRename', request: 'z.object({ root: z.string(), path: z.string(), newName: z.string() })', result: shiningResult('z.object({ path: z.string() })') },
  { method: 'fsDelete', request: rootPath, result: shiningResult('z.object({ path: z.string() })') },
  { method: 'gitStatus', request: rootRepo, result: shiningResult('z.object({ branch: z.string(), dirtyCount: z.number(), changes: z.array(z.object({ path: z.string(), status: z.union([z.literal("M"), z.literal("A"), z.literal("D"), z.literal("U")]) })) })') },
  { method: 'gitCheckout', request: 'z.object({ root: z.string(), repoPath: z.string(), branch: z.string() })', result: shiningResult('z.object({ output: z.string() })') },
  { method: 'gitCreateBranch', request: 'z.object({ root: z.string(), repoPath: z.string(), name: z.string() })', result: shiningResult('z.object({ output: z.string() })') },
  { method: 'gitPull', request: rootRepo, result: shiningResult('z.object({ output: z.string() })') },
  { method: 'chat', request: 'z.object({ messages: z.array(z.object({ role: z.union([z.literal("system"), z.literal("user"), z.literal("assistant")]), content: z.string() })), model: z.string(), apiBase: z.string(), apiKey: z.string() })', result: shiningResult('z.object({ content: z.string() })') },
]
