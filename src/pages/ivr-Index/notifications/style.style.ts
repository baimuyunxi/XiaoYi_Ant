import {createStyles} from 'antd-style';

const useStyles = createStyles(({token}) => {
  return {
    labelCol: {
      flex: 'none',
      whiteSpace: 'nowrap',
    },
    pickerCol: {
      flex: 'auto',
    },
    labelColWithPadding: {
      flex: 'none',
      whiteSpace: 'nowrap',
      paddingLeft: '22px !important',
      paddingRight: '0px !important'
    },
    buttonCol: {
      flex: 'none',
      whiteSpace: 'nowrap',
      paddingLeft: '16px !important',
    },
    noMarginH1: {
      marginBottom: '0',
    },
    customCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    customExtra: {
      marginLeft: 'auto', // 将按钮推向右边
    },
    greenButton: {
      borderColor: "#27ac66",
      color: "#27ac66",
    },
  }
});

export default useStyles;
