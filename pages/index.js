import React, { Fragment } from 'react'
import { Row, Col, Card, Badge, Typography } from 'antd'
const { Text } = Typography
import { LoginOutlined, LogoutOutlined, ClockCircleOutlined, CoffeeOutlined } from '@ant-design/icons';
import moment from 'moment';
import { connect } from 'react-redux';
import Fullscreen from "react-full-screen";
import { setOrganik, setNewHandkey } from "../redux/actions/organik.action"
import _ from 'lodash'
import TextyAnim from 'rc-texty'
moment.locale('id')
import async from 'async'
import { shift_ppnpn } from '../config/env.config'

const hijau = '#59FF93'
const hijau2 = "#20BDA1"
const merah = "#FB2162"
const orange = "#FB6660"
const hitam = "#0C4056"
const abuabu = '#A1B8BC'

class Index extends React.Component {
  state = {
    isFull: false,
    last_fingerprint_online: undefined,
    isOnline: false,
    message: '',
    showMsg: true,
    mountMsg: true,
    today: moment().day(),
    time: moment(),
    today_id: moment().format('YYYY_MM_DD'),
    yest_id: moment().subtract(1, 'day').format('YYYY_MM_DD'),
    msgs: [
      'Sudahkah Anda Handkey?',
      'Badan Pusat Statistik',
      'Visi: Pelopor data statistik terpercaya untuk semua',
      'Profesional, Integritas, Amanah',
      'Profesional:',
      'kompeten',
      'efektif',
      'efisien',
      'inovatif',
      'sistemik',
      'Integritas:',
      'dedikasi',
      'disiplin',
      'konsisten',
      'terbuka',
      'akuntabel',
      'Amanah:',
      'terpercaya',
      'jujur',
      'tulus',
      'adil'
    ],
    organik_all: [
      {
        id_fingerprint: '1',
        nama: 'Ade Ida Mane, SST, M.Si',
        presensi: {
          tanggal: new Date(),
          handkey_time: [moment().hour(7).minute(0).second(0), moment().hour(12).minute(0).second(0), moment().hour(14).minute(0).second(0)]
        }
      },
      {
        id_fingerprint: '2',
        nama: 'Agung Darwin, SST',
        presensi: {
          tanggal: new Date(),
          handkey_time: [moment().hour(7).minute(0).second(0), moment().hour(12).minute(0).second(0), moment().hour(16).minute(0).second(0)]
        }
      },
      {
        id_fingerprint: '4',
        nama: 'Alim Bakhri, SE',
        presensi: {
          tanggal: new Date(),
          handkey_time: [moment().hour(7).minute(0).second(0), moment().hour(12).minute(0).second(0), moment().hour(13).minute(25).second(0)]
        }
      },
      {
        id_fingerprint: '5',
        nama: 'Arsyad Kadir',
        presensi: {
          tanggal: new Date(),
          handkey_time: [moment().hour(7).minute(0).second(0), moment().hour(12).minute(0).second(0)]
        }
      },
      {
        active: false,
        id_fingerprint: "5",
        isPpnpn: true,
        nama: "Andi Irfan",
        nmjab: "Mitra",
        presensi: [{
          handkey_time: [moment().subtract(1, 'day').hour(16).minute(0).second(0), moment().subtract(1, 'day').hour(23).minute(30).second(0)],
          _id: "2020_06_06"
        }, {
          handkey_time: [],
          _id: "2020_06_07"
        }],
        _id: "085"
      },
      {
        active: false,
        id_fingerprint: "6",
        isPpnpn: true,
        nama: "Mariani",
        nmjab: "Mitra",
        presensi: [{
          handkey_time: [],
          _id: "2020_06_06"
        }, {
          handkey_time: [moment().hour(7).minute(28).second(0)],
          _id: "2020_06_07"
        }],
        _id: "77"
      },
    ],
  }
  handleCheckIn = (newUserPresensi) => {
    const { dispatch } = this.props;
    dispatch(setNewHandkey(newUserPresensi.id_fingerprint, newUserPresensi.new_handkey_time))
  }

  getPresensi = (presensiArray, time) => {
    const isBefore1130 = presensiArray[0] ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss').isBefore(moment(time).hour(11).minute(29).second(59)) : undefined;
    if (presensiArray.length > 1) {
      const isAfter1330 = moment(presensiArray[presensiArray.length - 1], 'YYYY/MM/DD HH:mm:ss').isAfter(moment(time).hour(13).minute(29).second(59));
      return {
        datang: isBefore1130 ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss') : undefined,
        mid: (() => {
          let _mid = undefined;
          presensiArray.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isAfter(moment(time).hour(11).minute(29).second(59)) && moment(t, 'YYYY/MM/DD HH:mm:ss').isBefore(moment(time).hour(13).minute(29).second(59))) {
              _mid = t
            }
          })
          return _mid ? moment(_mid, 'YYYY/MM/DD HH:mm:ss') : _mid
        })(),
        pulang: isAfter1330 ? moment(presensiArray[presensiArray.length - 1], 'YYYY/MM/DD HH:mm:ss') : undefined,
      }
    } else {
      if (presensiArray[0]) {
        const isAfter1330 = moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss').isAfter(moment(time).hour(13).minute(29).second(59));
        return {
          datang: isBefore1130 ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss') : undefined,
          mid: !isBefore1130 && !isAfter1330 ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss') : undefined,
          pulang: isAfter1330 ? moment(presensiArray[0], 'YYYY/MM/DD HH:mm:ss') : undefined
        }
      } else {
        return {
          datang: undefined,
          mid: undefined,
          pulang: undefined
        }
      }
    }
  }

  getAllDayHandkey = (presensi) => {
    return {
      today: presensi[0]._id === this.state.today_id ? presensi[0].handkey_time : presensi[1].handkey_time, // 'YYYY/MM/DD HH:mm:ss'
      yest: presensi[0]._id === this.state.yest_id ? presensi[0].handkey_time : presensi[1].handkey_time // 'YYYY/MM/DD HH:mm:ss'
    }
  }

  isShiftMalam = (name) => {
    return this.state.time.isBetween(
      moment(this.state.time).hour(7).minute(29).second(59),
      moment(this.state.time).hour(17).minute(59).second(59)
    ) ?
      (shift_ppnpn[name][this.state.time.day()][0] ? false : shift_ppnpn[name][moment(this.state.time).subtract(1, 'day').day()][1])
      : (shift_ppnpn[name][moment(this.state.time).subtract(1, 'day').day()][1] || shift_ppnpn[name][this.state.time.day()][1])
  }

  getPresensiShift = (presensi, time, name) => {
    if (!this.isShiftMalam(name)) return this.getPresensi(this.getAllDayHandkey(presensi).today, time)
    const isUp1800 = time.isAfter(moment(time).hour(17).minute(59).second(59))
    if (isUp1800) {
      return {
        datang: (() => {
          let _datang = undefined;
          this.getAllDayHandkey(presensi).today.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isBetween(
              moment(time).hour(17).minute(59).second(59),
              moment(time).hour(23).minute(29).second(59)
            )) {
              if (!_datang) _datang = t
            }
          })
          return _datang ? moment(_datang, 'YYYY/MM/DD HH:mm:ss') : _datang
        })(),
        mid: (() => {
          let _mid = undefined;
          this.getAllDayHandkey(presensi).today.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isBetween(
              moment(time).hour(23).minute(29).second(59),
              moment(time).hour(23).minute(59).second(59)
            )) {
              _mid = t
            }
          })
          return _mid ? moment(_mid, 'YYYY/MM/DD HH:mm:ss') : _mid
        })(),
        pulang: undefined
      }
    } else {
      return {
        datang: (() => {
          let _datang = undefined;
          this.getAllDayHandkey(presensi).yest.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isBetween(
              moment(time).subtract(1, 'day').hour(17).minute(59).second(59),
              moment(time).subtract(1, 'day').hour(23).minute(29).second(59)
            )) {
              _datang = t
            }
          })
          return _datang ? moment(_datang, 'YYYY/MM/DD HH:mm:ss') : _datang
        })(),
        mid: (() => {
          let _mid = undefined;
          this.getAllDayHandkey(presensi).yest.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isBetween(
              moment(time).subtract(1, 'day').hour(23).minute(29).second(59),
              moment(time).hour(1).minute(30).second(0)
            )) {
              _mid = t
            }
          })
          this.getAllDayHandkey(presensi).today.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isBetween(
              moment(time).subtract(1, 'day').hour(23).minute(29).second(59),
              moment(time).hour(1).minute(30).second(0)
            )) {
              _mid = t
            }
          })
          return _mid ? moment(_mid, 'YYYY/MM/DD HH:mm:ss') : _mid
        })(),
        pulang: (() => {
          let _pulang = undefined;
          this.getAllDayHandkey(presensi).today.forEach(t => {
            if (moment(t, 'YYYY/MM/DD HH:mm:ss').isBetween(
              moment(time).hour(7).minute(29).second(59),
              moment(time).hour(11).minute(30).second(0)
            )) {
              _pulang = t
            }
          })
          return _pulang ? moment(_pulang, 'YYYY/MM/DD HH:mm:ss') : _pulang
        })()
      }
    }
  }

  getBgColorNormal = (handkey_time, time) => {
    return moment(time).isAfter(moment(time).hour(11).minute(29).second(59)) ? (
      moment(time).isAfter(moment(time).hour(time.day() === 5 ? 16 : 15).minute(time.day() === 5 ? 29 : 59).second(59)) ? (this.getPresensi(handkey_time, time).pulang ?
        (this.getPresensi(handkey_time, time).pulang.isAfter(moment(time).hour(time.day() === 5 ? 16 : 15).minute(time.day() === 5 ? 29 : 59).second(59)) ? hijau : orange) : orange) :
        (this.getPresensi(handkey_time, time).mid ? hijau : orange)
    ) : (this.getPresensi(handkey_time, time).datang ? hijau : orange)
  }

  getBgColorShift = (presensi, time, name) => {
    if (!this.isShiftMalam(name))
      return this.getBgColorNormal(this.getAllDayHandkey(presensi).today, time)
    return moment(time).isAfter(moment(time).hour(1).minute(29).second(59)) && moment(time).isBefore(moment(time).hour(11).minute(30).second(0)) ? (
      this.getPresensiShift(presensi, time, name).pulang && moment(time).isAfter(moment(time).hour(7).minute(29).second(59)) ? hijau : (moment(time).isBefore(moment(time).hour(7).minute(29).second(59)) ? hijau : orange)
    ) : (
        (moment(time).isAfter(moment(time).hour(23).minute(29).second(59)) && moment(time).isBefore(moment(time).hour(23).minute(59).second(59))) ||
          (moment(time).isAfter(moment(time).hour(0).minute(0).second(0)) && moment(time).isBefore(moment(time).hour(1).minute(30).second(0))
          ) ?
          (this.getPresensiShift(presensi, time, name).mid ? hijau : orange)
          : (this.getPresensiShift(presensi, time, name).datang && moment(time).isBetween(moment(time).hour(17).minute(59).second(59), moment(time).hour(23).minute(29).second(59)) ? hijau : orange))
  }

  getAllOrg = () => {
    const { socket, dispatch } = this.props;
    dispatch(setOrganik(socket))
  }

  runTextAnimation = () => {
    async.series({
      off: (cb) => {
        this.setState({
          showMsg: false,
        }, () => {
          setTimeout(() => {
            cb(null, '1. off finish')
          }, this.state.message.split('').length * 50 + 1000)
        })
      },
      ganti: (cb) => {
        this.setState({
          mountMsg: false,
        }, () => {
          let pos = 0;
          for (let i = 0; i < this.state.msgs.length; i++) {
            if (this.state.msgs[i] === this.state.message) {
              pos = i + 1;
              if (pos > this.state.msgs.length - 1) pos = 0;
            }
          }
          this.setState({
            message: this.state.msgs[pos],
            mountMsg: true
          }, () => {
            cb(null, '2. ganti finish')
          })
        })
      },
      on: (cb) => {
        this.setState({
          showMsg: true,
        }, () => {
          setTimeout(() => {
            cb(null, '1. on finish')
          }, this.state.message.split('').length * 50)
        })
      }
    }, (err, finish) => {
      this.runTextAnimation()
    })
  }

  componentDidMount = () => {
    this.interval = setInterval(() => {
      this.setState({ time: moment() }, () => {
        if (this.state.last_fingerprint_online) {
          if (moment().diff(this.state.last_fingerprint_online, 'seconds') > 10) this.setState({ isOnline: false })
        }
        if (this.state.time.day() !== this.state.today) {
          this.setState({
            today: moment().day(),
            today_id: moment().format('YYYY_MM_DD'),
            yest_id: moment().subtract(1, 'day').format('YYYY_MM_DD'),
          }, () => {
            this.getAllOrg()
          })
        }
      })
    }, 1000);
    this.runTextAnimation()
    if (this.props.socket) {
      this.props.socket.on('checkin', this.handleCheckIn)
      this.props.socket.on('last_fingerprint_online', (last_fingerprint_online) => this.setState({ isOnline: true, last_fingerprint_online: moment(last_fingerprint_online, 'YYYY/MM/DD HH:mm:ss') }))
      this.getAllOrg()
    }
  }
  componentDidUpdate(prevProps) {
    if (this.props.socket !== prevProps.socket) {
      this.props.socket.on('checkin', this.handleCheckIn)
      this.props.socket.on('last_fingerprint_online', (last_fingerprint_online) => this.setState({ isOnline: true, last_fingerprint_online: moment(last_fingerprint_online, 'YYYY/MM/DD HH:mm:ss') }))
      this.getAllOrg()
    }
  }
  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { time, isOnline, isFull, message, showMsg, mountMsg } = this.state;
    const { organik_all, router } = this.props;
    return <div style={router.query.zoomin === "80"?{}:{ minHeight: '140vh' }}>
      <Fullscreen
        enabled={this.state.isFull}
        onChange={isFull => this.setState({ isFull })}
      >
        <Row onClick={() => this.setState({ isFull: !isFull })} align="middle">
          <Col xs={24} md={4} style={{ textAlign: "center" }}>
            <img src={`/static/bps.png`} className={'logo-bps'} />
          </Col>
          <Col xs={24} md={16}>
            <Row justify="center" align="bottom">
              <Col>
                <span style={{ fontSize: 20, color: hitam }}><strong>{time.format('dddd, DD MMMM YYYY')}</strong></span>
              </Col>
              <Col>
                <span style={{ fontSize: 80, margin: "0 25px", color: `${time.isAfter(moment(time).hour(time.day() === 5 ? 16 : 15).minute(time.day() === 5 ? 29 : 59).second(59)) || time.isBefore(moment(time).hour(7).minute(30).second(0)) ? hijau2 : orange}` }}>
                  <strong>{time.format('HH:mm:ss')}</strong>
                </span>
              </Col>
              <Col>
                <Badge status={`${isOnline ? 'processing' : 'error'}`} text={`Mesin Presensi ${isOnline ? 'Online' : 'Offline'}`} />
              </Col>
            </Row>
          </Col>
          <Col xs={24} md={4} style={{ textAlign: "center" }}>
            <img src={`/static/logo.png`} className={'logo'} />
          </Col>
        </Row>
        {[undefined, true].map(b => <Row>
          {organik_all.map(d =>
            d.isPpnpn === b ? <Col xs={24} md={12} lg={6} key={d._id}>
              <Card bodyStyle={{
                backgroundColor: d.isPpnpn ? this.getBgColorShift(d.presensi, time, d.nama) : this.props.spd_nip[d._id] ? abuabu : this.getBgColorNormal(d.presensi.handkey_time, time)
                , padding: 5
              }}>
                <Row gutter={[0, 8]}>
                  <Col xs={24} style={{ textAlign: "center" }}>
                    <strong style={{ fontSize: 20, color: hitam }}>{d.nama}</strong>
                  </Col>
                </Row>
                <Row justify="center" style={{ textAlign: "center" }}>
                  <Col xs={5}>
                    {d.isPpnpn === undefined || !this.isShiftMalam(d.nama) ? <LoginOutlined /> : <Badge count={<CoffeeOutlined />} style={{ fontSize: 14 }}>
                      <LoginOutlined />
                    </Badge>}
                  </Col>
                  <Col xs={5}>
                    {d.isPpnpn === undefined || !this.isShiftMalam(d.nama) ? <ClockCircleOutlined rotate={-135} /> : <Badge count={<CoffeeOutlined />} style={{ fontSize: 14 }}>
                      <ClockCircleOutlined rotate={-135} />
                    </Badge>}
                  </Col>
                  <Col xs={5}>
                    <LogoutOutlined />
                  </Col>
                </Row>
                {!d.isPpnpn ? <Row justify="center" style={{ textAlign: "center" }}>
                  <Col xs={5}>
                    {this.getPresensi(d.presensi.handkey_time, time).datang ? <strong>{this.getPresensi(d.presensi.handkey_time, time).datang.format('HH:mm:ss')}</strong> : '-'}
                  </Col>
                  <Col xs={5}>
                    {this.getPresensi(d.presensi.handkey_time, time).mid ? <strong>{this.getPresensi(d.presensi.handkey_time, time).mid.format('HH:mm:ss')}</strong> : '-'}
                  </Col>
                  <Col xs={5}>
                    {this.getPresensi(d.presensi.handkey_time, time).pulang ? <strong>{this.getPresensi(d.presensi.handkey_time, time).pulang.format('HH:mm:ss')}</strong> : '-'}
                  </Col>
                </Row> : <Row justify="center" style={{ textAlign: "center" }}>
                    <Col xs={5}>
                      {this.getPresensiShift(d.presensi, time, d.nama).datang ? <strong>{this.getPresensiShift(d.presensi, time, d.nama).datang.format('HH:mm:ss')}</strong> : '-'}
                    </Col>
                    <Col xs={5}>
                      {this.getPresensiShift(d.presensi, time, d.nama).mid ? <strong>{this.getPresensiShift(d.presensi, time, d.nama).mid.format('HH:mm:ss')}</strong> : '-'}
                    </Col>
                    <Col xs={5}>
                      {this.getPresensiShift(d.presensi, time, d.nama).pulang ? <strong>{this.getPresensiShift(d.presensi, time, d.nama).pulang.format('HH:mm:ss')}</strong> : '-'}
                    </Col>
                  </Row>}
              </Card>
            </Col> : null
          )}
        </Row>)}
        <div style={{ paddingLeft: 5, fontSize: 11 }}>
          <strong>keterangan</strong><br />
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 15, height: 15, background: orange, display: 'inline-block', verticalAlign: 'middle' }}></div> belum handkey&emsp;
          </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 15, height: 15, background: hijau, display: 'inline-block', verticalAlign: 'middle' }}></div> sudah handkey&emsp;
          </div>
          <div style={{ display: 'inline-block' }}>
            <div style={{ width: 15, height: 15, background: abuabu, display: 'inline-block', verticalAlign: 'middle' }}></div> dinas luar&emsp;
          </div>
        </div>
        <Row justify="center" align="bottom">
          <Col style={{ textAlign: "center" }}>
            {mountMsg ? <TextyAnim type="right" mode="smooth" style={{ fontSize: 45, color: hitam, fontFamily: '"Monotype Corsiva", Helvetica, sans-serif' }}>{showMsg && message}</TextyAnim> : null}
          </Col>
        </Row>
      </Fullscreen>
    </div>
  }
}

function mapStateToProps(state) {
  const { socket } = state.socket
  const { organik_all, spd_nip } = state.organik
  return { socket, organik_all, spd_nip }
}

export default connect(mapStateToProps)(Index)

//merah: #FF7772
//hijau: #59FF93
//abu-abu: #A1B8BC