import React, { Fragment } from 'react'
import Router from 'next/router'
import { Row, Col, Typography } from 'antd'
import moment from 'moment';
import { connect } from 'react-redux';
moment.locale('id')

const { Title } = Typography;

class Index extends React.Component {
  state = {
    time: moment().format('HH:mm:ss'),
    data: []
  }
  handleCheckIn = (data) => {
    console.log(data);
    this.setState({
      data: [...this.state.data, { id: '57', date: '20200313 16:30' }]
    })
  }
  componentDidMount = () => {
    setInterval(() => this.setState({ time: moment().format('HH:mm:ss') }), 1000);
    setTimeout(() => {
      console.log(this.props);
      this.props.socket.on('checkin', this.handleCheckIn)
    }, 2000)
  }
  render() {
    const { time, data } = this.state;
    return <Fragment>
      <Row justify="center">
        <Col style={{ fontSize: 20 }}>
          <span>Presensi <strong>{moment().format('dddd, DD MMMM YYYY')}</strong></span><br />
          <span>Pukul <strong>{time}</strong></span>
        </Col>
      </Row>
      <Row>
        <Col>
          {data.map(d => <div>{d.id} {d.date}</div>)}
        </Col>
      </Row>
    </Fragment>
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  return { socket }
}

export default connect(mapStateToProps)(Index)