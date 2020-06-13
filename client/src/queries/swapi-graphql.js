
function getAllPersonDataQuery() {
    return `
    query getAllPeople($after: String){
        allPeople(first:10,after:$after) { 
            edges { cursor, node { name id } } 
            pageInfo {
                endCursor
            }
        }
    }`
}

export default { getAllPersonDataQuery }