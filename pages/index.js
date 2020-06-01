import React, { Fragment } from 'react'
import Router from 'next/router'
import { Button, Row, Col, Typography, Card, Badge } from 'antd'
import moment, { relativeTimeThreshold } from 'moment';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import { setOrganik, setNewHandkey } from "../redux/actions/organik.action"
import _ from 'lodash'
import TextyAnim from 'rc-texty'
moment.locale('id')

const { Title } = Typography;

const hijau = "#20BDA1"
const merah = "#FB2162"
const orange = "#FB6660"
const hitam = "#0C4056"

class Index extends React.Component {
  state = {
    isFull: false,
    last_fingerprint_online: undefined,
    isOnline: false,
    message: 'Sudahkah Anda Handkey?',
    showMsg: true,
    today: moment().day(),
    time: moment(),
    msgs: [
      'Sudahkah Anda Handkey?',
      'Badan Pusat Statistik',
      'Visi: Pelopor data statistik terpercaya untuk semua',
      'PROFESIONAL, INTEGRITAS, AMANAH',
      'PROFESIONAL:',
      'kompeten',
      'efektif',
      'efisien',
      'inovatif',
      'sistemik',
      'INTEGRITAS:',
      'dedikasi',
      'disiplin',
      'konsisten',
      'terbuka',
      'akuntabel',
      'AMANAH:',
      'terpercaya',
      'jujur',
      'tulus',
      'adil'
    ]
  }
  handleCheckIn = (newUserPresensi) => {
    const { dispatch } = this.props;
    dispatch(setNewHandkey(newUserPresensi.id_fingerprint, newUserPresensi.new_handkey_time))
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

  runTextAnimation = () => {
    setTimeout(() => this.setState({ showMsg: !this.state.showMsg }, () => {
      this.runTextAnimation();
      setTimeout(() => {
        let pos = 0;
        for (let i = 0; i < this.state.msgs.length; i++) {
          if (this.state.msgs[i] === this.state.message) {
            pos = i + 1;
            if (pos > this.state.msgs.length-1) pos = 0;
          }
        }
        this.setState({ showMsg: true, message: this.state.msgs[pos] })
      }, this.state.message.split('').length * 50);
    }), 4000);
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
    this.runTextAnimation()
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
    const { time, isOnline, isFull, message, showMsg } = this.state;
    const { organik_all } = this.props;
    return <Fragment>
      <Fullscreen
        enabled={this.state.isFull}
        onChange={isFull => this.setState({ isFull })}
        style={{ background: 'inherit' }}
      >
        <Row justify="center" align="bottom" onClick={() => this.setState({ isFull: !isFull })}>
          <Col>
            <span style={{ fontSize: 20, color: hitam }}><strong>{time.format('dddd, DD MMMM YYYY')}</strong></span>
          </Col>
          <Col>
            <span style={{ fontSize: 80, margin: "0 25px", color: `${time.isAfter(moment(time).hour(16).minute(time.day() === 5 ? 30 : 0).second(0)) || time.isBefore(moment(time).hour(7).minute(29).second(59)) ? hijau : orange}` }}>
              <strong>{time.format('HH:mm:ss')}</strong>
            </span>
          </Col>
          <Col>
            <Badge status={`${isOnline ? 'processing' : 'error'}`} text={`Mesin Presensi ${isOnline ? 'Online' : 'Offline'}`} />
          </Col>
        </Row>
        <Row>
          {organik_all.map(d =>
            <Col span={6} key={d._id}>
              <Card bodyStyle={{
                backgroundColor: this.getPresensi(d.presensi.handkey_time, time).pulang ? (
                  this.getPresensi(d.presensi.handkey_time, time).pulang.isAfter(moment(time).hour(16).minute(time.day() === 5 ? 30 : 0).second(0)) ? '#A1B8BC' : '#59FF93'
                ) : (
                    this.getPresensi(d.presensi.handkey_time, time).datang ? '#59FF93' : orange
                  ), padding: 5
              }}>
                <span style={{ fontSize: 20, color: hitam }}><strong>{d.nama}</strong></span><br />
                <span>Datang: {this.getPresensi(d.presensi.handkey_time, time).datang ? this.getPresensi(d.presensi.handkey_time, time).datang.format('HH:mm:ss') : '-'}</span><br />
                <span>Pulang: {this.getPresensi(d.presensi.handkey_time, time).pulang ? this.getPresensi(d.presensi.handkey_time, time).pulang.format('HH:mm:ss') : '-'}</span>
              </Card>
            </Col>
          )}
        </Row>
        <div style={{ paddingLeft: 10 }}>
          <strong>Keterangan</strong><br />
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 30, height: 15, background: orange, display: 'inline-block', verticalAlign: 'middle' }}></div> Belum Hadir&emsp;
        </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 30, height: 15, background: hijau, display: 'inline-block', verticalAlign: 'middle' }}></div> Hadir&emsp;
        </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 30, height: 15, background: '#A1B8BC', display: 'inline-block', verticalAlign: 'middle' }}></div> Pulang&emsp;
        </div>
        </div>
        <Row justify="center" align="bottom">
          <Col>
            <TextyAnim type="right" mode="smooth" interval={50} duration={450} style={{ fontSize: 30, color: hijau }}>{showMsg && message}</TextyAnim>
          </Col>
        </Row>
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