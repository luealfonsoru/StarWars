import React, { Component } from 'react';
import { Layout, Row, Col, Card, Space, Button, Tooltip, Drawer } from 'antd';
import ApolloClient, { gql } from 'apollo-boost';
import { useQuery, ApolloProvider } from '@apollo/react-hooks';
import { PlusOutlined, RobotFilled, EllipsisOutlined } from '@ant-design/icons'
import query from './queries/swapi-graphql';
import Modal from 'react-modal';
import './App.css';

const { Header, Content, Footer } = Layout

const modalStyles = {
  content: {
    height: '100vh',
    top: '0px',
    width: '100vw',
    left: '0px'
  }
};

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
  const [visible, setVisible] = React.useState({});

  const showDrawer = (id) => {
    console.log(id)
    setVisible({ [id]: true });
  };

  const onClose = (id) => {
    setVisible({ [id]: false });
  };
  const { loading, error, data, fetchMore } = useQuery(gql`${query.getAllPersonDataQuery()}`, { variables: { after: null } })
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;
  console.log(data)
  return (
    <Layout>
      <Header style={{ color: "white", fontSize: "17px" }} ><RobotFilled /> May the force be with you!
      </Header>
      <Content>
        <Row>
          {data.allPeople.edges.map((info) => {
            return (
              <Col key={info.cursor}>
                <Drawer
                  title={`Movies in which ${info.node.name} appears`}
                  placement="bottom"
                  closable={false}
                  onClose={() => onClose(info.node.id)}
                  visible={visible[info.node.id]}
                >
                  <Row>
                    {info.node.filmConnection.edges.map((filmInfo) => {
                      return (
                        <Col>
                          <Card
                            style={{ width: "calc(45vw - 14px)", marginLeft: "10px", height: "50vh", marginTop: "5px" }}
                            title={`${filmInfo.node.title} ${filmInfo.node.episodeID ? `- Episode ${filmInfo.node.episodeID}` : ''}`}
                          >
                            <p><span style={{ fontWeight: 500 }}>Opening Text: </span>"{filmInfo.node.openingCrawl}"</p>
                            <p><span style={{ fontWeight: 500 }}>Director: </span>{filmInfo.node.director}</p>
                            <p><span style={{ fontWeight: 500 }}>Producers: </span>{filmInfo.node.producers}</p>
                            <p><span style={{ fontWeight: 500 }}>Planets: </span>{filmInfo.node.planetConnection.edges.map((planetInfo) => {
                              return (
                                <span key={planetInfo.cursor} >
                                  {`${planetInfo.node.name}, `} 
                                </span>
                              )
                            })}{filmInfo.node.producers}</p>
                          </Card>
                        </Col>
                      )
                    })}
                  </Row>
                </Drawer>
                <Space>
                  <Card
                    style={{ width: "calc(20vw - 14px)", marginLeft: "10px", height: "40vh", marginTop: "10px" }}
                    title={info.node.name}
                    extra={<Tooltip placement="bottom" title="See More"><a onClick={() => showDrawer(info.node.id)}><EllipsisOutlined /></a></Tooltip>}
                  >
                    <p><span style={{ fontWeight: 500 }}>Born on:</span> {info.node.birthYear}</p>
                    <p><span style={{ fontWeight: 500 }}>Home World:</span> {info.node.homeworld.name}</p>
                    <p><span style={{ fontWeight: 500 }}>Gender: </span> {info.node.gender}</p>
                  </Card>
                </Space>
              </Col>
            )
          })}
        </Row>
        <Button
          style={{ width: "calc(100vw - 30px)", marginLeft: "10px", marginTop: "10px", marginBottom: "10px" }}
          icon={<PlusOutlined />}
          onClick={() => {
            const endCursor = data.allPeople.pageInfo.endCursor
            console.log(data.allPeople.pageInfo.endCursor)
            fetchMore({
              variables: {
                after: endCursor
              },
              updateQuery: (prevResult, { fetchMoreResult }) => {
                console.log(prevResult, fetchMoreResult)
                fetchMoreResult.allPeople.edges = [...prevResult.allPeople.edges, ...fetchMoreResult.allPeople.edges]
                return fetchMoreResult
              }
            })
          }}>Show More</Button>
      </Content >
    </Layout >
  )

}

export default App;
