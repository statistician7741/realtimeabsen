import App, { Container } from 'next/app'
import Head from 'next/head'
import { initStore } from '../redux/store'
import io from "socket.io-client";
import { Icon, message, notification } from 'antd'
import { Provider } from 'react-redux'
import React from 'react'
import { setSocket } from '../redux/actions/socket.action'
import { setOrganik } from '../redux/actions/organik.action'
import withRedux from "next-redux-wrapper";

import style from './_app.less';

class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    return { pageProps }
  }

  showInfoMessage = (msg) => {
    message.info(msg);
  }

  showSuccessMessage = (msg) => {
    message.success(msg);
  }

  showWarningMessage = (msg) => {
    message.warning(msg);
  }

  showErrorMessage = (msg) => {
    message.error(msg);
  }

  handleOnConnect = () => {
    const { store: {dispatch, getState} } = this.props;
    dispatch(setOrganik(getState().socket.socket))
  };

  componentDidMount = () => {
    if (!this.props.store.getState().socket.socket) {
      const socket = io.connect(`http://${window.location.hostname}:82`);
      this.props.store.dispatch(setSocket(socket))
      socket.on('connect', this.handleOnConnect)
    }
  }

  render() {
    const { Component, pageProps, store } = this.props
    return (
      <Provider store={store}>
        <div>
          <Head>
            <title>{`Presensi`}</title>
            <meta name="viewport" content="initial-scale=1.0, width=device-width" />
            <link rel='shortcut icon' type='image/x-icon' href='/static/favicon.ico' />
          </Head>
          <Component
            {...pageProps}
            showInfoMessage={this.showInfoMessage}
            showSuccessMessage={this.showSuccessMessage}
            showWarningMessage={this.showWarningMessage}
            showErrorMessage={this.showErrorMessage}
          />
        </div>
      </Provider>
    )
  }
}

export default withRedux(initStore)(MyApp);