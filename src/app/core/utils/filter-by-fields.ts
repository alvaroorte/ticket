export const filterOfArrayByFields = ( wordKey: string, arrayBase: any[], fields: string[] ) => {
    let result: any = [];
    for ( let row of arrayBase) {
        for (let field of fields) {
            if ( row[field]?.toLowerCase().indexOf( wordKey.toLowerCase() ) > -1 ) {
                result.push(row)
                break;
            }
        }
    }
    return result;
}