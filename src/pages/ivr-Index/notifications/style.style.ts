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
  };
});

export default useStyles;
