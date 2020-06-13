
function getAllPersonDataQuery() {
    return `
    query getAllPeople($after: String){
        allPeople(first:10,after:$after) { 
            edges {
                cursor, 
                node {
                    name 
                    birthYear 
                    gender 
                    homeworld {
                        name
                    } 
                    id 
                    filmConnection {
                        edges {
                            cursor
                            node {
                                title
                                episodeID
                                openingCrawl
                                director
                                producers
                                planetConnection{
                                    edges{
                                        cursor
                                        node{
                                            name
                                        }
                                    }
                                }
                            }
                        }
                    } 
                } 
            } 
            pageInfo {
                endCursor
            }
        }
    }`
}

export default { getAllPersonDataQuery }