export function formatDate(date: string): string {
    const formattedDate = new Date(date);
    const day = String(formattedDate.getDate()).padStart(2, '0');
    const month = String(formattedDate.getMonth() + 1).padStart(2, '0');
    const year = formattedDate.getFullYear();

    return `${year}-${month}-${day}`;
}

export function removeTextIntoParentheses( text: string ): string {
    let result = text?? '';
    if ( result && result.indexOf('(') >= 0 ) {
        result = text.substring(0, text.indexOf('(')) + text.substring(text.indexOf(')')+1, text.length);
    }
    return result;
}