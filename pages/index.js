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
        name: 'Ade Ida Mane, SST, M.Si',
        presensi: [moment().hour(6).minute(55).second(58),]
      },
      {
        id: 2,
        name: 'Agung Darwin, SST',
        presensi: []
      },
      {
        id: 4,
        name: 'Alim Bakhri, SE',
        presensi: [moment()]
      },
      {
        id: 5,
        name: 'Arsyad Kadir',
        presensi: [moment()]
      },
      {
        id: 6,
        name: 'Ashadi',
        presensi: [moment()]
      },
      {
        id: 7,
        name: 'Asri Samsu Alam, SE',
        presensi: []
      },
      {
        id: 8,
        name: 'Dyah Tari Nur\'aini, SST',
        presensi: [moment()]
      },
      {
        id: 9,
        name: 'Erni Octaviani, S.Tr.Stat.',
        presensi: [moment()]
      },
      {
        id: 10,
        name: 'Faiq Fajar Pujiadhi, S.Tr.Stat.',
        presensi: [moment()]
      },
      {
        id: 11,
        name: 'Fitri Permata Sari, SST',
        presensi: [moment()]
      },
      {
        id: 12,
        name: 'Hasnawati P.',
        presensi: []
      },
      {
        id: 13,
        name: 'Idhar Rahim',
        presensi: []
      },
      {
        id: 14,
        name: 'Ma\'ruf, S.P',
        presensi: [moment()]
      },
      {
        id: 15,
        name: 'Marniati',
        presensi: []
      },
      {
        id: 53,
        name: 'Muh. Shamad, SST',
        presensi: [moment()]
      },
      {
        id: 54,
        name: 'Muslimin, SP',
        presensi: [moment()]
      },
      {
        id: 55,
        name: 'Naufal Fahmi Zakiuddin, SST',
        presensi: [moment()]
      },
      {
        id: 56,
        name: 'Sanur Saprah, SE',
        presensi: []
      },
      {
        id: 57,
        name: 'Sapari',
        presensi: [moment()]
      },
      {
        id: 58,
        name: 'Suci Safitriani, SST',
        presensi: [moment().hour(7).minute(29).second(58)]
      },
      {
        id: 59,
        name: 'Untung',
        presensi: [moment()]
      },
      {
        id: 3,
        name: 'Yunita Nur Khasanah, SST',
        presensi: [moment()]
      },
      {
        id: 31,
        name: 'Zulfikar Halim Lumintang, SST',
        presensi: [moment(), moment().hour(16).minute(44).second(58)]
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
        <Row gutter={2}>
          {user.map(d =>
            <Col span={6}>
              <Card bodyStyle={{
                backgroundColor: `${
                  d.presensi.length > 1 ? (
                    d.presensi[d.presensi.length - 1].isAfter(moment(time).hour(16).minute(time.day() === 5 ? 30 : 0).second(0)) ? '#A1B8BC' : '#FF7772'
                  ) : (
                      d.presensi[0] ? (
                        d.presensi[0].isBefore(moment(time).hour(7).minute(29).second(59)) ? '#59FF93' : '#FF7772'
                      ) : '#FF7772'
                    )
                  }`, padding: 5
              }}>
                <span><strong>{d.name}</strong></span><br />
                <span>Datang: {d.presensi[0] ? d.presensi[0].format('HH:mm:ss') : '-'}</span><br />
                <span>Pulang: {d.presensi.length > 1 ? d.presensi[d.presensi.length-1].format('HH:mm:ss') : '-'}</span>
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

//merah: #FF7772
//hijau: #59FF93
//abu-abu: #A1B8BC