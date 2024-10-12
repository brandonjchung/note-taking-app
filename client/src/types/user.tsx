type stylePreferences = {
    primaryButtonColor: string,
    secondaryButtonColor: string,
    backgroundColor: string,
    labelColor: string,
    noteColor: string
}

export type User = {
    _id: string,
    username: string,
    password: string,
    stylePreferences: stylePreferences
}