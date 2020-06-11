import React, { Component } from 'react';
import { Button, Layout, Pagination, Row, Col, Card, Space } from 'antd';
import ApolloClient, { gql } from 'apollo-boost';
import { useQuery, ApolloProvider } from '@apollo/react-hooks';
import swapi from './services/swapi-graphql';
import './App.css';

const { Header, Content, Footer } = Layout
const client = new ApolloClient({
  uri: 'http://localhost:8080',
});

function App() {
  return (
    <ApolloProvider client={client}>
      <Layout>
        <Header>Header</Header>
        <Content>
          <Componented></Componented>
        </Content>
        <Footer><Pagination defaultCurrent={1} total={50}></Pagination></Footer>
      </Layout>
    </ApolloProvider>
  )
}

function Componented() {
  const { loading, error, data } = useQuery(gql`${swapi.getAllPersonDataQuery()}`)
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data)
  return (
    <Row>
      {data.allPeople.edges.map((info) => (
        <Col key={info.cursor}>
          <Space>
            <Card>{info.node.name}</Card>
          </Space>
        </Col>
      ))}
    </Row>)

}

export default App;
