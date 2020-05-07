import React, { Fragment } from 'react'
import Router from 'next/router'
import { Button, Row, Col, Typography, Card } from 'antd'
import moment, { relativeTimeThreshold } from 'moment';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
moment.locale('id')

const { Title } = Typography;

const user = {
  '1': {
    name: 'Admin'
  },
  '53': {
    name: 'Muh. Shamad, SST'
  },
  '3': {
    name: 'Yunita Nur Khasanah, SST'
  }
}

class Index extends React.Component {
  state = {
    isFull: false,
    time: moment(),
    data: [{ id: '53', name: user['53'].name, time: moment() }]
  }
  handleCheckIn = (newData) => {
    console.log(newData);
    this.setState({
      data: [...this.state.data, { id: newData.id, name: user[newData.id].name, time: moment(newData.time) }]
    })
  }
  componentDidMount = () => {
    this.interval = setInterval(() => this.setState({ time: moment() }), 1000);
    setTimeout(() => {
      this.props.socket.on('checkin', this.handleCheckIn)
    }, 2000)
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { time, data, isFull } = this.state;
    return <Fragment>
      <Fullscreen
        enabled={this.state.isFull}
        onChange={isFull => this.setState({ isFull })}
        style={{ background: 'inherit' }}
      >
        <Row justify="center">
          <Col style={{ fontSize: 20 }}>
            <span onClick={() => this.setState({ isFull: !isFull })}>Presensi <strong>{time.format('dddd, DD MMMM YYYY')}</strong></span><br />
            <span>Pukul <strong>{time.format('HH:mm:ss')}</strong></span>
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#F24B59" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#F24B59" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#09A603" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#09A603" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#F24B59" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#09A603" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#F24B59" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#F24B59" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#09A603" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
        </Row>
        <Row gutter={8}>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#F24B59" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
          <Col span={4}>
            {data.map(d => <Card style={{ backgroundColor: "#09A603" }}>
              <span>{d.name}</span>
              <span>{d.time.format('YYYY/MM/DD HH:mm:ss')}</span>
            </Card>)}
          </Col>
        </Row>
      </Fullscreen>
    </Fragment>
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  return { socket }
}

export default connect(mapStateToProps)(Index)