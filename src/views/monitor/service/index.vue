<template>
  <div class="app-container">
    <el-row>
      <el-col>
        <el-card class="box-card">
          <svg-icon icon-class="system" style="margin-right: 5px" />
          <span>
            系统：{{ service.platform }}
          </span>
          <span>
            IP：{{ service.ip }}
          </span>
          <span>
            项目已不间断运行：{{ service_data.sys.run_time }}
          </span>
        </el-card>
      </el-col>
    </el-row>
    <el-row>
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <span>状态</span>
        </div>
        <el-col :span="8">
          <div class="title">CPU使用率</div>
          <div class="title">
            <el-progress type="circle" :percentage="service_data.cpu.percent" />
          </div>
          <div class="title">{{ service_data.cpu.count }}</div>
        </el-col>
        <el-col :span="8">
          <div class="title">内存使用率</div>
          <div class="title">
            <el-progress type="circle" :percentage="service_data.mem.percent" />
          </div>
          <div class="title">{{ service_data.mem.used }} / {{ service_data.mem.total }}</div>
        </el-col>
        <el-col :span="8">
          <div class="title">磁盘使用率</div>
          <div class="title">
            <el-progress type="circle" :percentage="service_data.disk.percent" />
          </div>
          <div class="title">{{ service_data.disk.used }} / {{ service_data.disk.total }}</div>
        </el-col>
      </el-card>
    </el-row>
    <el-row>
      <el-col :span="12">
        333
      </el-col>
      <el-col :span="12">
        333
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
import { getService } from '@/api/monitor/service'
export default {
  name: 'Service',
  data() {
    return {
      websock: null,
      monitor: null, // 监控定时器
      service: {
        'platform': '',
        'ip': ''
      },
      service_data: {
        'cpu': {
          'percent': 0,
          'count': ''
        },
        'mem': {
          'percent': 0,
          'total': '',
          'free': '',
          'used': ''
        },
        'disk': {
          'percent': 0,
          'total': '',
          'free': '',
          'used': ''
        },
        'sys': {
          'run_time': ''
        }
      }
    }
  },
  created() {
    this.initWebSocket()
    this.getService()
  },
  destroyed() {
    // 清除定时器
    if (this.monitor) {
      clearInterval(this.monitor)
    }
    // 关闭socket
    if (this.websock) {
      this.websock.close()
    }
  },
  methods: {
    getService() {
      getService().then(res => {
        this.service = res.data
      })
    },
    initWebSocket() { // 初始化weosocket
      const wsuri = process.env.VUE_APP_WS_API + '/monitor/service?token=' + getToken()
      this.websock = new WebSocket(wsuri)
      this.websock.onmessage = this.websocketonmessage
      this.websock.onopen = this.websocketonopen
      this.websock.onerror = this.websocketonerror
      this.websock.onclose = this.websocketclose
    },
    websocketonopen() { // 连接建立之后执行send方法发送数据
      const data = { 'tonken': getToken() }
      this.monitor = setInterval(this.websocketsend(JSON.stringify(data)), 2000)
    },
    websocketonerror() { // 连接建立失败重连
      this.initWebSocket()
    },
    websocketonmessage(e) { // 数据接收
      const redata = JSON.parse(e.data)
      this.service_data = redata
      console.log(redata)
    },
    websocketsend(Data) { // 数据发送
      this.websock.send(Data)
    },
    websocketclose(e) { // 关闭
      console.log('断开连接', e)
    }
  }
}
</script>
<style lang="scss" scoped>
 ::v-deep .box-card {
    margin-bottom: 5px;
    span {
      margin-right: 40px;
    }
  }
.title {
    text-align: center;
    margin: 10px 0
  }
</style>
