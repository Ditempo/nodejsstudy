module.exports= function(router, passport){
    console.log('user_passport 호출됨');
    // var router= express.Router();
    // app.use('/',router);
    
    router.route('/').get(function(req, res){
        console.log('/ get 요청됨.');
        res.render('index.ejs',{});
    })


    router.route('/login')
    .get(function(req,res){
        console.log('/login get');
        res.render('login',{message : req.flash('loginMessage')});
    })
    .post(passport.authenticate('local-login', {
        successRedirect : '/userlist',
        failureRedirect : '/login',
        failureFlash : true
    }));

    router.route('/signup')
    .get(function(req,res){
        console.log('/signup get');
        res.render('signup',{message:req.flash('signupMessage')});
    })
    .post(passport.authenticate('local-signup',{
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    router.route('/profile')
    .get(function(req, res){
        console.log('/profile get');

        console.log('req.user 객체의 값');
        console.dir(req.user);

        if(!req.user){
            console.log('사용자 인증이 안 된 상태임.');
            res.redirect('/');
            return;
        }

        console.log('사용자 인증된 상태임.');
        if(Array.isArray(req,user)){
            res.render('profile',{user : req.user[0]._doc});
        }else{
            res.render('profile',{user : req.user});
        }
    });

    router.route('/logout')
    .get(function(req, res){
        console.log('/logout get');
        req.logout();
        res.redirect('/');
    });
}