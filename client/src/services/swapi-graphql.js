
function getAllPersonDataQuery(){
    return`
    {
        allPeople(first: 10) { edges { cursor, node { name id } } }
    }`
}

export default { getAllPersonDataQuery }