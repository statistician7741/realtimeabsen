import React, { Fragment } from 'react'
import Router from 'next/router'
import { Button, Row, Col, Typography, Card } from 'antd'
import moment, { relativeTimeThreshold } from 'moment';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
moment.locale('id')

const { Title } = Typography;

class Index extends React.Component {
  state = {
    isFull: false,
    time: moment(),
    user: [
      {
        id: 1,
        name: 'Admin',
        presensi: []
      },
      {
        id: 53,
        name: 'Muh. Shamad, SST',
        presensi: []
      },
      {
        id: 3,
        name: 'Yunita Nur Khasanah, SST',
        presensi: []
      }
    ]
  }
  handleCheckIn = (newData) => {
    console.log(newData);
    this.setState({
      user: [...this.state.data, { id: newData.id, name: user[newData.id].name, time: moment(newData.time) }]
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
    const { time, user, isFull } = this.state;
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
          {user.map(d =>
            <Col span={4}>
              <Card bodyStyle={{ backgroundColor: `${d}`, padding: 5 }}>
                <span>{d.name}</span><br />
                <span>{d.time}</span><br />
                <span>{d.time}</span>
              </Card>
            </Col>
          )}
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