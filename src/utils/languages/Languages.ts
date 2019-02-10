import * as englishLanguage from './en_EN.json'

export enum Languages {
    ENGLISH
}

export class Language {

    private languages: Map<Languages, any>

    constructor() {
        this.languages = new Map<Languages, any>()
        this.languages.set(Languages.ENGLISH, englishLanguage)
    }

    getLabel(language: Languages, identifier: string): string {
        return this.languages.get(language)[identifier]
    }

}

export function formatString(str: string, ...val: any[]) {
    if (str == null) return null
    for (let index = 0; index < val.length; index++) {
        str = str.replace(`{${index}}`, val[index])
    }
    return str
}