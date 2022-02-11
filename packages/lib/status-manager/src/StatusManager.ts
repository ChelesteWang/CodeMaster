import produce, {applyPatches, enableAllPlugins, enablePatches, Patch} from '@cdl/immer/src/immer'

enablePatches()
enableAllPlugins()

export interface MutationsType {
    [propName: string]: (state: any, ...payload: any[]) => void
}

export type StatusManagerPluginEntryType = (
    opportunity: string,
    ctx: StatusManager,
    ...options: any
) => void
export type StatusManagerPluginObjectType = {
    entry: StatusManagerPluginEntryType
}
export type StatusManagerPluginType =
    | StatusManagerPluginEntryType
    | StatusManagerPluginObjectType

export interface InitOptionType {
    key: string
    dataType?: 'layout' | 'style' | 'other' | 'any' | 'global'
    state: Object
    mutations: MutationsType
    hooks?: Partial<{
        beforeCommit: (oldData: any) => void
        committed: (newData: any) => void
        beforeDataChange: (oldData: any) => void
        dataChanged: (newData: any) => void
    }>
    pluginConfig?: any
}

class StatusManager {
    key: string
    dataType: 'layout' | 'style' | 'other' | 'any' | 'global' = 'global'
    state: Array<any> | Map<any, any> | Set<any> | Object
    pluginConfig: any = {}
    private replaces: Patch[][] = []
    private inverseReplaces: Patch[][] = []
    private position: number = 0
    private readonly beforeCommit: (oldData: any) => void = () => {
    }
    private readonly committed: (newData: any) => void = () => {
    }
    private readonly beforeDataChange: (oldData: any) => void = () => {
    }
    private readonly dataChanged: (newData: any) => void = () => {
    }
    private readonly mutations: MutationsType

    private static plugins: Array<StatusManagerPluginType> = []

    public static registerPlugin(plugin: StatusManagerPluginType) {
        this.plugins.push(plugin)
    }

    constructor(initOption: InitOptionType) {
        this.state = produce(
            initOption.state || {},
            () => {
            }
        )
        this.mutations = initOption.mutations
        this.key = initOption.key
        this.dataType = initOption.dataType || this.dataType
        this.beforeCommit = initOption.hooks?.beforeCommit || this.beforeCommit
        this.committed = initOption.hooks?.committed || this.committed
        this.beforeDataChange =
            initOption.hooks?.beforeDataChange || this.beforeDataChange
        this.dataChanged = initOption.hooks?.dataChanged || this.dataChanged

        this.toRunPlugin('init')
    }

    public trigger(name: string, payload: any) {
        this.toRunPlugin(name, payload)
    }

    public commit(name: string, payload: any) {
        if (
            this.mutations[name] != null &&
            typeof this.mutations[name] == 'function'
        ) {
            this.beforeCommit(this.state)
            this.beforeDataChange(this.state)
            this.toRunPlugin('beforeDataChange')

            this.state = produce(
                this.state,
                // @ts-ignore
                (draft) => {
                    let result = this.mutations[name](draft, payload)
                    if (result != null) return result
                },
                (patches, inversePatches) => {
                    if (this.position >= this.replaces.length) {
                        this.replaces.push(patches)
                        this.inverseReplaces.push(inversePatches)
                    } else {
                        this.replaces.length = this.position + 1
                        this.inverseReplaces.length = this.position + 1
                        this.replaces[this.position] = patches
                        this.inverseReplaces[this.position] = inversePatches
                    }

                    this.position = this.replaces.length
                }
            )
            this.toRunPlugin('dataChanged')
            this.dataChanged(this.state)
            this.committed(this.state)
        }
    }

    clearHistory() {
        this.replaces = []
        this.inverseReplaces = []
        this.position = 0
    }

    back(step: number = 1) {
        if (this.position == 0 || this.inverseReplaces.length == 0) return false;
        let _temp = step;
        this.beforeDataChange(this.state)
        this.toRunPlugin('beforeDataChange')
        while (step-- > 0 && this.position > 0 && this.position <= this.inverseReplaces.length) {
            this.state = applyPatches(
                this.state,
                this.inverseReplaces[this.position-1] || []
            )
            this.position--
        }
        this.toRunPlugin('dataChanged')
        this.dataChanged(this.state)
        return _temp > 0;
    }

    forward(step: number = 1) {
        if (this.position >= this.replaces.length || this.replaces.length == 0) return false;
        let _temp = step;
        this.beforeDataChange(this.state)

        this.toRunPlugin('beforeDataChange')
        while (step-- > 0 && this.position < this.replaces.length) {
            if (this.replaces.length > 1) {
                this.state = applyPatches(
                    this.state,
                    this.replaces[this.position] || []
                )
                this.position++
            } else {
                break;
            }
        }
        this.toRunPlugin('dataChanged')
        this.dataChanged(this.state)
        return _temp > 0;
    }

    private toRunPlugin(name: string, option?: any) {
        StatusManager.plugins.forEach((e) => {
            if (typeof e == 'function') {
                e(name, this, option)
            } else {
                e.entry(name, this, option)
            }
        })
    }
}

export default StatusManager

