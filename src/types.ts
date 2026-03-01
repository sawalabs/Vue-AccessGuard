export type MatchMode = 'any' | 'all'

export interface AccessUser<P extends string = string, R extends string = string> {
    roles?: R[]
    permissions?: P[]
}

export type CanDirectiveValue = string | string[] | { permission: string | string[], mode?: MatchMode }