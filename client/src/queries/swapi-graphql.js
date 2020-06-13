// Query to get data from GraphQL Server; for pagination purposes, it get $after as the cursor of the latest Element, 
//this parameter is updated each time "Show more" button is clicked inside App.js
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