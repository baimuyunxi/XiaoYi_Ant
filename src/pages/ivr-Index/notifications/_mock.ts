import type {Request, Response} from 'express';

const TableCallVolumeData = [
  {
    "success": true,
    "code": 20000,
    "message": "成功",
    "data": {
      "items": [
        {
          hrSpecialArea: '10000号整体',
          hrContactPoint: '总呼入量',
          hrDate: "342342",
          hrChains: '-0.74',
        },
        {
          hrSpecialArea: '10000号整体',
          hrContactPoint: '人工呼入量',
          hrDate: "12342",
          hrChains: '-5.44',
        },
        {
          hrSpecialArea: '10000号整体',
          hrContactPoint: '转人工占比',
          hrDate: "29.84",
          hrChains: '-1.7',
        },
        {
          hrSpecialArea: '互联网卡专区',
          hrContactPoint: '总呼入量',
          hrDate: "342322",
          hrChains: '-0.74',
        },
        {
          hrSpecialArea: '互联网卡专区',
          hrContactPoint: '人工呼入量',
          hrDate: "1232",
          hrChains: '-4.4',
        },
        {
          hrSpecialArea: '互联网卡专区',
          hrContactPoint: '转人工占比',
          hrDate: "3",
          hrChains: '1.74',
        },
        {
          hrSpecialArea: '涉诈专区',
          hrContactPoint: '总呼入量',
          hrDate: "342",
          hrChains: '-0.4',
        },
        {
          hrSpecialArea: '涉诈专区',
          hrContactPoint: '人工呼入量',
          hrDate: "42",
          hrChains: '-5.44',
        },
        {
          hrSpecialArea: '涉诈专区',
          hrContactPoint: '转人工占比',
          hrDate: "2",
          hrChains: '-0.74',
        },
      ],
      "remark":[
        {
          hrRemarks: "场景转人工环比+/-xxPP，影响整体转人工+/-xxPP"
        },
        {
          hrRemarks: "主动转人工环比+/-xxPP，影响整体转人工+/-xxPP"
        },
        {
          hrRemarks: "拒识转人工环比+/-xxPP，影响整体转人工+/-xxPP"
        },
      ]
    },
  },
];

const TableSatisfactionData = [
  {"success": true,
    "code": 20000,
    "message": "成功",
    "data": {
      "items": [
        {
          mydChannel: '短信满意度',
          mydContactPoint: '参评量',
          mydDate: '1',
          mydChains: '2',
        },
        {
          mydChannel: '短信满意度',
          mydContactPoint: '参评量',
          mydDate: '3',
          mydChains: '4',
        },
        {
          mydChannel: '短信满意度',
          mydContactPoint: '满意率',
          mydDate: '5',
          mydChains: '6',
        },
        {
          mydChannel: '在线满意度',
          mydContactPoint: '参评量',
          mydDate: '7',
          mydChains: '8',
        },
        {
          mydChannel: '在线满意度',
          mydContactPoint: '参评量',
          mydDate: '9',
          mydChains: '10',
        },
        {
          mydChannel: '在线满意度',
          mydContactPoint: '满意率',
          mydDate: '11',
          mydChains: '12',
        },
        {
          mydChannel: '微信满意度',
          mydContactPoint: '参评量',
          mydDate: '13',
          mydChains: '14',
        },
        {
          mydChannel: '微信满意度',
          mydContactPoint: '参评量',
          mydDate: '15',
          mydChains: '16',
        },
        {
          mydChannel: '微信满意度',
          mydContactPoint: '满意率',
          mydDate: '17',
          mydChains: '18',
        },
        {
          mydChannel: '整体满意度',
          mydContactPoint: '参评量',
          mydDate: '18',
          mydChains: '19',
        },
        {
          mydChannel: '整体满意度',
          mydContactPoint: '参评量',
          mydDate: '19',
          mydChains: '20',
        },
        {
          mydChannel: '整体满意度',
          mydContactPoint: '满意率',
          mydDate: '21',
          mydChains: '22',
        },
      ],
      "remark":[
        {
          mydRemarks:'1场景环比+/-xxPP，影响短信整体满意度+/-xxPP',
        },
        {
          mydRemarks:'2场景环比+/-xxPP，影响短信整体满意度+/-xxPP',
        },
        {
          mydRemarks:'3场景环比+/-xxPP，影响短信整体满意度+/-xxPP',
        },
        {
          mydRemarks:'1场景环比+/-xxPP，影响在线整体满意度+/-xxPP',
        },
        {
          mydRemarks:'2场景环比+/-xxPP，影响在线整体满意度+/-xxPP',
        },
        {
          mydRemarks:'3场景环比+/-xxPP，影响在线整体满意度+/-xxPP',
        },
        {
          mydRemarks:'1场景环比+/-xxPP，影响微信整体满意度+/-xxPP',
        },
        {
          mydRemarks:'2场景环比+/-xxPP，影响微信整体满意度+/-xxPP',
        },
        {
          mydRemarks:'3场景环比+/-xxPP，影响微信整体满意度+/-xxPP',
        },
        {
          mydRemarks:'1场景环比+/-xxPP，影响整体满意度+/-xxPP',
        },
        {
          mydRemarks:'2场景环比+/-xxPP，影响整体满意度+/-xxPP',
        },
        {
          mydRemarks:'3场景环比+/-xxPP，影响整体满意度+/-xxPP',
        },
      ]
    }
  },
];

function getIvrCallVolume(_: Request, res: Response) {
  return res.json({
    data: {
      TableCallVolumeData,
    },
  });
}

function getIvrSatisfaction(_: Request, res: Response) {
  return res.json({
    data: {
      TableSatisfactionData,
    },
  });
}

export default {
  'POST /api/ivrIndex/callVolume': getIvrCallVolume,
  'POST /api/ivrIndex/Satisfaction': getIvrSatisfaction,
};
