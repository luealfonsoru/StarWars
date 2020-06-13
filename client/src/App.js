//Import React module
import React from 'react';
// Modules from Apollo
import ApolloClient, { gql } from 'apollo-boost';
import { useQuery, ApolloProvider } from '@apollo/react-hooks';
//Modules from Ant Design
import { Layout, Row, Col, Card, Space, Button, Tooltip, Drawer, Spin } from 'antd';
import { PlusOutlined, RobotFilled, EllipsisOutlined } from '@ant-design/icons';
//Custom Modules
import query from './queries/swapi-graphql';
import './App.css';

// It handles layout elements inside the main view
const { Header, Content } = Layout

// Define Custom Styles NOTE: it has to be inside it own module or inside App.css, as there are so few, I let them inside App.js

const personCardStyles = {
  width: "calc(20vw - 14px)",
  marginLeft: "10px",
  height: "40vh",
  marginTop: "10px"
}

const subtitleStyles = {
  fontWeight: 500
}

const filmCardStyles = {
  width: "calc(45vw - 14px)",
  marginLeft: "10px",
  height: "50vh",
  marginTop: "5px"
}

const loaderStyles = {
  width: '100vw',
  marginTop: '50vh',
  textAlign: 'center',
  marginBottom: '50vh'
}

// Main App entry component
function App() {
  const client = new ApolloClient({
    uri: 'http://localhost:8080',
  });
  // Wrap to Apollo Provider
  return (
    <ApolloProvider client={client}>
      <Layout>
        {/* Header, on 'App' so it could be reused in possible future components  */}
        <Header style={{ color: "white", fontSize: "17px" }} ><RobotFilled /> May the force be with you!
      </Header>
        <Content>
          {/* Component with people list  */}
          <PeopleList></PeopleList>
        </Content>
      </Layout>
    </ApolloProvider>)
}


// People list component
function PeopleList() {
  // Set states for Drawer
  const [visible, setVisible] = React.useState({});

  // Handlers
  const showDrawer = (id) => {
    setVisible({ [id]: true });
  };
  const onClose = (id) => {
    setVisible({ [id]: false });
  };
  //Call and set parameters for query used to get data, from GraphQL SWAPI DB
  const { loading, error, data, fetchMore } = useQuery(gql`${query.getAllPersonDataQuery()}`, { variables: { after: null } })
  //While loading data from GraphQL server, present loader
  if (loading) return <Spin size="large" style={loaderStyles} />;
  //Show error if there is an issue with connection to GraphQL server
  if (error) return <p>Error :(</p>;
  //
  return (
    <>
      <Row>
        {/* Map data gotten from GraphQL server related to allPerson */}
        {data.allPeople.edges.map((info) => {
          return (
            <Col key={info.cursor}>
              {/* Drawer that use "visible" state in order to be shown when "See more" (right upper corner) button is pressed */}
              <Drawer
                title={`Movies in which ${info.node.name} appears`}
                placement="bottom"
                closable={false}
                onClose={() => onClose(info.node.id)}
                visible={visible[info.node.id]}
              >
                {/* The Drawer contains info about films in which each charcter appears */}
                <Row>
                  {info.node.filmConnection.edges.map((filmInfo) => {
                    return (
                      // Render film information list component
                      <FilmInfoList info={filmInfo}></FilmInfoList>
                    )
                  })}
                </Row>
              </Drawer>
              <Space>
                {/* Card displaying basic information about characters */}
                <Card
                  style={personCardStyles}
                  title={info.node.name}
                  extra={<Tooltip placement="bottom" title="See More"><Button shape="circle" onClick={() => showDrawer(info.node.id)}><EllipsisOutlined /></Button></Tooltip>}
                >
                  <p><span style={subtitleStyles}>Born on:</span> {info.node.birthYear}</p>
                  <p><span style={subtitleStyles}>Home World:</span> {info.node.homeworld.name}</p>
                  <p><span style={subtitleStyles}>Gender: </span> {info.node.gender}</p>
                </Card>
              </Space>
            </Col>
          )
        })}
      </Row>
      {/* Button that handles pagination; as cursors are used on server queries instead of offset, it works as a "show more" button */}
      <Button
        style={{ width: "calc(100vw - 30px)", marginLeft: "10px", marginTop: "10px", marginBottom: "10px" }}
        icon={<PlusOutlined />}
        onClick={() => {
          // Fetch data and update list of people 
          const endCursor = data.allPeople.pageInfo.endCursor
          fetchMore({
            variables: {
              after: endCursor
            },
            updateQuery: (prevResult, { fetchMoreResult }) => {
              fetchMoreResult.allPeople.edges = [...prevResult.allPeople.edges, ...fetchMoreResult.allPeople.edges]
              return fetchMoreResult
            }
          })
        }}>Show More</Button>
    </>
  )

}

// Film info list component, called and to be shown inside the peopleList Drawer. 
// It got information related to all firms in which a character  as a parameter
function FilmInfoList(info) {
  const filmInfo = info.info
  return (
    <Col key={filmInfo.cursor}>
      <Card
        style={filmCardStyles}
        title={`${filmInfo.node.title} ${filmInfo.node.episodeID ? `- Episode ${filmInfo.node.episodeID}` : ''}`}
      >
        <p><span style={subtitleStyles}>Opening Text: </span>"{filmInfo.node.openingCrawl}"</p>
        <p><span style={subtitleStyles}>Director: </span>{filmInfo.node.director}</p>
        <p><span style={subtitleStyles}>Producers: </span>{filmInfo.node.producers}</p>
        <p><span style={subtitleStyles}>Planets: </span>{filmInfo.node.planetConnection.edges.map((planetInfo) => {
          return (
            <span key={planetInfo.cursor} >
              {`${planetInfo.node.name}, `}
            </span>
          )
        })}{filmInfo.node.producers}</p>
      </Card>
    </Col>)
}

export default App;
