app.post('/saveRecruitBoard', function(req,res){
  if(req.session.usernum == null || req.session.userid == null){
    res.send('<script>alert("로그인 해주세요.");window.location.href="/";</script>');
  }

  var usernum = req.session.usernum;
  var username = req.session.userid;
  var prname = req.body.prname;
  var area = req.body.area;
  var recruits = req.body.recruits;
  var content = req.body.content;
  var password = req.body.password;
  var dataset = [usernum, prname, area, recruits, username, content, password];

  // req.body.var : 요청 페이지에서 post 방식으로 전송한 html 데이터들 중 var 이름의 데이터
  // req.query.var : 요청 페이지에서 get 방식으로 전송한 html 데이터들 중 var 이름의 데이터
  // req.session.var : 세션 객체에 저장된 데이터 중 var 이름의 데이터

// sql : 데이터베이스 쿼리, dataset : 쿼리문에 들어갈 값, function(err, row) : SQL 쿼리 콜백 함수
  connection.query(sql, dataset, function(err, row){
    if(err){
      console.log(err);
      // 해당 js 코드를 response로써 전송
      res.send('<script>alert("saveRecruitBoard내부에 오류가 발생했습니다. 다시 시도해 주세요.");window.history.back();</script>');
    } else {
      // 게시판 목록으로 리다이렉트
      res.redirect('/recruit');
    }
  });
});
