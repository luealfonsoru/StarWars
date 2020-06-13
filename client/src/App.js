import React, { Component } from 'react';
import { Layout, Row, Col, Card, Space, Button } from 'antd';
import ApolloClient, { gql } from 'apollo-boost';
import { useQuery, ApolloProvider } from '@apollo/react-hooks';
import swapi from './queries/swapi-graphql';
import './App.css';

const { Header, Content, Footer } = Layout

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       minValue: 0,
//       maxValue: 10,
//       current: 1
//     };
//   }
//   changePage = value => {
//     console.log("change state", value)
//     if (value <= 1) {
//       this.setState({
//         minValue: 0,
//         maxValue: 10,
//         current: 1
//       });
//     } else {
//       this.setState({
//         minValue: this.state.maxValue,
//         maxValue: value * 10,
//         current: value
//       });
//     }
//   };
//   render() {
//     const client = new ApolloClient({
//       uri: 'http://localhost:8080',
//     });
//     return (
//       <ApolloProvider client={client}>
//         <MainInfoCards states={this.state} onChange={this.changePage}></MainInfoCards>
//       </ApolloProvider>)
//   }
// }

function App() {

  {
    const client = new ApolloClient({
      uri: 'http://localhost:8080',
    });
    return (
      <ApolloProvider client={client}>
        <MainInfoCards></MainInfoCards>
      </ApolloProvider>)
  }
}

function MainInfoCards() {
  const { loading, error, data, fetchMore } = useQuery(gql`${swapi.getAllPersonDataQuery()}`, { variables: { after: null } })
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data)
  return (
    <Layout>
      <Header>Header</Header>
      <Content>
        <Row>
          {data.allPeople.edges.map((info) => (
            <Col key={info.cursor}>
              <Space>
                <Card>{info.node.name}</Card>
              </Space>
            </Col>
          ))}
        </Row>
        <Button onClick={() => {
          const endCursor = data.allPeople.pageInfo.endCursor
          console.log(data.allPeople.pageInfo.endCursor)
          fetchMore({
            variables: {
              after: endCursor
            },
            updateQuery: (prevResult,{fetchMoreResult}) =>{
              console.log(prevResult,fetchMoreResult)
              fetchMoreResult.allPeople.edges = [...prevResult.allPeople.edges, ...fetchMoreResult.allPeople.edges]
              return fetchMoreResult
            }
          })
        }}>Show More</Button>
      </Content>
    </Layout>
  )

}

export default App;
