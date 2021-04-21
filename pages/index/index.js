// pages/index/index.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    //模拟数据
    playlist: [{
      id: 0,
      title: '贝贝',
      singer: '李荣浩',
      //太难听了
      //src:'http://localhost:3000/1.mp3'
      //百度的音乐外链
      src: 'https://sharefs.yun.kugou.com/202005211650/bd9478522cc7683c35e4fe28d6f9b60f/G102/M02/0D/11/RpQEAFvFunmIZiysAAD-3Z4OE-8AAA8VQEuesIAAP8A419.mp3',
      coverImgUrl: '/images/cover.jpg'
    }, {
      id: 1,
      title: '最天使',
      singer: '苗田雨',
       //太难听了
       //src:'http://localhost:3000/2.mp3'
       //百度的音乐外链
      src: 'https://sharefs.yun.kugou.com/202005211631/4db56e12786df4a297081900c5ac23d8/G211/M06/0E/08/c4cBAF6XqMWAWntvAD20FwYr_cs832.mp3',
      coverImgUrl: '/images/cover.jpg'
    },{
      id: 2,
      title: '理想',
      singer: '赵雷',
      src: 'https://sharefs.yun.kugou.com/202005211650/0368ca4822c2e449a4fc9d4953755077/G191/M0B/0D/07/_w0DAF5ctSOAdc-cAEwriqeXFxg068.mp3',
      coverImgUrl: '/images/cover.jpg'
    }],
    //状态
    state: 'paused',
    //导航栏索引
    dateCut: 0,
    //当前播放
    playIndex: 0,
    //播放列表索引
    songIndex:0,
    play: {
      currentTime: '00:00',
      duration: '00:00',
      percent: 0,
      title: '',
      singer: '',
      coverImgUrl: '/images/cover.jpg'
    }
  },
  // 导航栏点击切换
  cut: function (e) {
    this.setData({
      dateCut: e.currentTarget.dataset.cut
    })
  },
  // 导航栏滑动切换
  changeTab: function (e) {
    this.setData({
      dateCut: e.detail.current
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  audioCtx: null,
  onReady: function () {
   this.audioCtx = wx.createInnerAudioContext()
   this.setMusic(0)
   var that = this
   //播放进度检测
   this.audioCtx.onError(function() {
     console.log('播放错误' + that.audioCtx.src)
   })
   //播放完成
   this.audioCtx.onEnded(function(){
      that.next()
   })
   //滑块 监听音频播放进度
   this.audioCtx.onTimeUpdate(function(){
    that.setData({
      'play.duration': formatTime(that.audioCtx.duration),
      'play.currentTime': formatTime(that.audioCtx.currentTime),
      'play.percent': that.audioCtx.currentTime / that.audioCtx.duration * 100
    })
    // 格式化时间
    function formatTime(time) {
      var minute = Math.floor(time / 60) % 60;
      var second = Math.floor(time) % 60
      return (minute < 10 ? '0' + minute : minute) + ':' + (second < 10 ? '0' + second : second)
    }
   })
  },
  //设置音乐
  setMusic:function(index){
    var music = this.data.playlist[index]
    this.audioCtx.src = music.src
    this.setData({
      playIndex:index,
      'play.title':music.title,
      'play.singer':music.singer,
      'play.coverImgUrl': music.coverImgUrl,
      'play.currentTime': '00:00',
      'play.duration': '00:00',
      'play.percent': 0
    })
  },
  //点击播放
  play:function(){
   this.audioCtx.play()
   this.setData({
    state: 'running'
  })
  },
  //暂停播放
  pause:function(){
    this.audioCtx.pause()
    this.setData({
      state: 'paused'
    })
  },
  // 下一曲按钮
  next: function() {
    var index = this.data.playIndex >= this.data.playlist.length - 1 ? 0 : this.data.playIndex + 1
    this.setMusic(index)
    this.play()
    this.setData({
      songIndex:index
    })
    //this.repair()
  },
  //拖动进度条功能
  sliderChange:function(e){
    var dragValue = e.detail.value * this.audioCtx.duration / 100
    this.audioCtx.seek(dragValue)
    //this.repair()
  },
  //列表按钮
  skip:function(){
    console.log('a')
    this.setData({
      dateCut:2
    })
  },
  //播放列表 切换歌曲
  songList:function(e){
  var song = e.currentTarget.dataset.song
  this.setData({songIndex:song})
  this.setMusic(song)
  this.play()
  //this.repair()
    },
  //InnerAudioContext播放完以后再次播放，onTimeUpdate生命周期不会再次触发 问题
  //需要暂停后在播放才能再次触发
  repair:function(){
    this.pause()
    var that = this
    setTimeout(()=>{
    that.play()
  },100)
  }
})