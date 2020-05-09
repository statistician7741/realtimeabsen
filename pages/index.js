import React, { Fragment } from 'react'
import Router from 'next/router'
import { Button, Row, Col, Typography, Card, Badge } from 'antd'
import moment, { relativeTimeThreshold } from 'moment';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import { setOrganik, setNewHandkey } from "../redux/actions/organik.action"
import _ from 'lodash'
moment.locale('id')

const { Title } = Typography;

class Index extends React.Component {
  state = {
    isFull: false,
    last_fingerprint_online: undefined,
    isOnline: false,
    today: moment().day(),
    time: moment(),
    users: [
      {
        id_fingerprint: '1',
        name: 'Ade Ida Mane, SST, M.Si',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '2',
        name: 'Agung Darwin, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '4',
        name: 'Alim Bakhri, SE',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '5',
        name: 'Arsyad Kadir',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '6',
        name: 'Ashadi',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '7',
        name: 'Asri Samsu Alam, SE',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '8',
        name: 'Dyah Tari Nur\'aini, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '9',
        name: 'Erni Octaviani, S.Tr.Stat.',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '10',
        name: 'Faiq Fajar Pujiadhi, S.Tr.Stat.',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '11',
        name: 'Fitri Permata Sari, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '12',
        name: 'Hasnawati P.',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '13',
        name: 'Idhar Rahim',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '14',
        name: 'Ma\'ruf, S.P',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '15',
        name: 'Marniati',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '53',
        name: 'Muh. Shamad, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '54',
        name: 'Muslimin, SP',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '55',
        name: 'Naufal Fahmi Zakiuddin, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '56',
        name: 'Sanur Saprah, SE',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '57',
        name: 'Sapari',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '58',
        name: 'Suci Safitriani, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '59',
        name: 'Untung',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '3',
        name: 'Yunita Nur Khasanah, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: []
        }
      },
      {
        id_fingerprint: '31',
        name: 'Zulfikar Halim Lumintang, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: [moment().hour(7).minute(59).second(59), moment().hour(12).minute(59).second(59)]
        }
      }
    ]
  }
  handleCheckIn = (newUserPresensi) => {
    const { dispatch } = this.props;
    dispatch(setNewHandkey(newUserPresensi.id_fingerprint, newUserPresensi.new_handkey_time))
    return
    const usersTemp = [...this.state.users];
    _.forEach(usersTemp, (user, i) => {
      if (user.id_fingerprint === newUserPresensi.id_fingerprint) {
        user.presensi.handkey_time.push(moment(newUserPresensi.newPresensi, 'YYYY/MM/DD HH:mm:ss'))
      }
    })
    this.setState({
      users: usersTemp
    })
  }

  getPresensi = (presensiArray, time) => {
    const isBefore12 = presensiArray[0] ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss').isBefore(moment(time).hour(11).minute(59).second(59)) : undefined;
    if (presensiArray.length > 1) {
      const isAfter12 = moment(presensiArray[presensiArray.length - 1], 'YYYY/MM/DD HH:mm:ss').isAfter(moment(time).hour(11).minute(59).second(59));
      return {
        datang: isBefore12 ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss') : undefined,
        pulang: isAfter12 ? moment(presensiArray[presensiArray.length - 1], 'YYYY/MM/DD HH:mm:ss') : undefined,
      }
    } else {
      if (presensiArray[0]) {
        return {
          datang: isBefore12 ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss') : undefined,
          pulang: isBefore12 ? undefined : moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss')
        }
      } else {
        return {
          datang: undefined,
          pulang: undefined
        }
      }
    }
  }

  getAllOrg = () => {
    const { socket, dispatch } = this.props;
    dispatch(setOrganik(socket))
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      this.setState({ time: moment() }, () => {
        if (this.state.last_fingerprint_online) {
          if (moment().diff(this.state.last_fingerprint_online, 'seconds') > 10) this.setState({ isOnline: false })
        }
        if (this.state.time.day() !== this.state.today) {
          this.setState({ today: moment().day() }, () => {
            this.getAllOrg()
          })
        }
      })
    }, 1000);
    setTimeout(() => {
      this.props.socket.on('checkin', this.handleCheckIn)
      this.props.socket.on('last_fingerprint_online', (last_fingerprint_online) => this.setState({ isOnline: true, last_fingerprint_online: moment(last_fingerprint_online, 'YYYY/MM/DD HH:mm:ss') }))
      this.getAllOrg()
    }, 2000)
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { time, isOnline, isFull } = this.state;
    const { organik_all } = this.props;
    return <Fragment>
      <Fullscreen
        enabled={this.state.isFull}
        onChange={isFull => this.setState({ isFull })}
        style={{ background: 'inherit' }}
      >
        <Row justify="center" align="bottom" gutter={16} onClick={() => this.setState({ isFull: !isFull })} style={{ paddingTop: 20 }}>
          <Col>
            <span style={{ fontSize: 20 }}><strong>{time.format('dddd, DD MMMM YYYY')}</strong></span>
          </Col>
          <Col>
            <span style={{ fontSize: 40 }}><strong>{time.format('HH:mm:ss')}</strong></span>
          </Col>
          <Col>
            <Badge status={`${isOnline ? 'processing' : 'error'}`} text={`Mesin Presensi ${isOnline ? 'Online' : 'Offline'}`} />
          </Col>
        </Row>
        <Row gutter={2}>
          {organik_all.map(d =>
            <Col span={6} key={d._id}>
              <Card bodyStyle={{
                backgroundColor: this.getPresensi(d.presensi.handkey_time, time).pulang ? (
                  this.getPresensi(d.presensi.handkey_time, time).pulang.isAfter(moment(time).hour(16).minute(time.day() === 5 ? 30 : 0).second(0)) ? '#A1B8BC' : '#59FF93'
                ) : (
                    this.getPresensi(d.presensi.handkey_time, time).datang ? '#59FF93' : '#FF7772'
                  ), padding: 5
              }}>
                <span><strong>{d.nama}</strong></span><br />
                <span>Datang: {this.getPresensi(d.presensi.handkey_time, time).datang ? this.getPresensi(d.presensi.handkey_time, time).datang.format('HH:mm:ss') : '-'}</span><br />
                <span>Pulang: {this.getPresensi(d.presensi.handkey_time, time).pulang ? this.getPresensi(d.presensi.handkey_time, time).pulang.format('HH:mm:ss') : '-'}</span>
              </Card>
            </Col>
          )}
        </Row>
        <div style={{ paddingLeft: 10 }}>
          Keterangan:<br />
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 30, height: 15, background: '#FF7772', display: 'inline-block', verticalAlign: 'middle' }}></div> : Tidak Hadir&emsp;
        </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 30, height: 15, background: '#59FF93', display: 'inline-block', verticalAlign: 'middle' }}></div> : Hadir&emsp;
        </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 30, height: 15, background: '#A1B8BC', display: 'inline-block', verticalAlign: 'middle' }}></div> : Pulang&emsp;
        </div>
        </div>
      </Fullscreen>
    </Fragment>
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  const { organik_all } = state.organik
  return { socket, organik_all }
}

export default connect(mapStateToProps)(Index)

//merah: #FF7772
//hijau: #59FF93
//abu-abu: #A1B8BC