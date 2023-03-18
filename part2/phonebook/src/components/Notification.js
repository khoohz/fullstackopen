const Notification = ({noti}) => {
    const notiStyle = {
      color: 'green',
      background: 'lightgrey',
      fontSize: 18,
      borderStyle: 'solid',
      borderRadius: 5,
      padding: 10,
      marginBottom: 10
    }
  
    if (noti === null) {
      return null
    }
  
    return (
      <div style={notiStyle}>
        {noti}
      </div>
    )
  }

export default Notification