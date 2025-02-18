type stylePreferences = {
    primaryButtonColor: string,
    secondaryButtonColor: string,
    backgroundColor: string,
    textColor: string,
    labelColor: string,
    noteColor: string
}

export type User = {
    _id: string,
    username: string,
    firstName: string,
    lastName: string,
    password: string,
    stylePreferences: stylePreferences,
    layout: string
}