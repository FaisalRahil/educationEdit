var express = require('express');
var router = express.Router();
var models  = require('../models');
var login = require('../app/login')(router);
var userHelpers = require('../app/userHelpers');

  var obj = {
    subjects :[{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'}],
    classes :[{ student:[{name:'محمد',id:'123450',name_en:'mohammed'}],class_id:2,class_name:'الثاني',subjects:[{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'}]},{ student:[{name:'محمد',id:'123450',name_en:'mohammed'}],class_id:3,class_name:'الاول',subjects:[{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'},{subject_ar:'رياضيات',subject_en:'math',subject_id:'5cs4',degree:'60.6'}]},{ student:[{name:'محمد',id:'123450',name_en:'mohammed'}],class_id:3,class_name:'الثالث'},{ student:[{name:'محمد',id:'123450',name_en:'mohammed'}],class_id:4,class_name:'الرابع'},{ student:[{name:'محمد',id:'123450',name_en:'mohammed'}],class_id:5,class_name:'الخامس'}],
  }


// Start Semester /////////////////////////////////////////////////////////
  // get all seme //
  router.get('/',userHelpers.isLogin, function(req, res) {
    var page = userHelpers.getPage(req);
    var limit = userHelpers.getLimit(page);
    models.Semester.findAndCountAll({
      where: {
        status: 1
      },
      limit : 10,
      offset: limit,
    }).then(function(semester) {
      var pageCount = userHelpers.getPageCount(semester.count);
      var pagination = userHelpers.paginate(page,pageCount);
        res.render('semesters', { title: 'عرض النظم الدراسية', name:req.session.name, semester: semester.rows,pagination:pagination, collapseOne: 'collapse in', activeOneOne: 'active' });
    });
  });

  router.get('/newSemester',userHelpers.isLogin, function(req, res) {
    res.render('newSemester', { title: 'إضافة نظام دراسي جديد', name:req.session.name,collapseOne: 'collapse in', activeOneTwo: 'active' });
  });

  router.get('/:id',userHelpers.isLogin, function(req, res) {
    models.Semester.findOne({
      where: {
        id: req.params.id,
        status: 1
      }
    }).then(function(semester) {
      models.Department.findAll({
        where: {
          status: 1
        }
      }).then(function(departments) {
        var semType="";
        if(semester.sem_type==0)
        {
          semType = "سنة";
        }
        if(semester.sem_type==1)
        {
          semType = "ربيعي";
        }
        if(semester.sem_type==2)
        {
        semType = "خريفي";
        }
        if(semester.sem_type==3)
        {
        semType = "صيفي";
        }

        res.render('semester', { title: 'Semester', name:req.session.name,sem:semType,semester:semester,departments:departments });
          //res.render('locations', { title: 'View Locations', loc: location, collapseTwo: 'collapse in', activeTwoOne: 'active' });
      });
    });
  });

  /*This route is to check if the semester exist before or not*/
  router.post('/checkSemester',userHelpers.isLogin, function(req, res) {
    models.Semester.findOne({
      where: {
        system_type: req.body.system_type,
        sem_type: req.body.sem_type,
        year: {
          $like : req.body.year+'%'
        },
        status: 1
      }
    }).then(function(result){
      if(result){
        res.send(false);// not safe to add semester
      } else {
        res.send(true);// safe to add semester
      }
    });
  });

  router.post('/newSemester',userHelpers.isLogin, function(req, res) {

    req.body.UserId=req.session.idu;
    models.Semester.create(req.body).then(function() {
      res.redirect('/semester?msg=1');
    });
  });

  // semester/#{semester.id}/updateSemester
  router.post('/:id/updateSemester/',userHelpers.isLogin, function(req, res) {
    if(req.body.sem_type == "ربيعي")
      {
        req.body.sem_type= 1;
      } 
    if(req.body.sem_type == "خريفي"){
      req.body.sem_type = 2;
      } 

    if(req.body.sem_type == "صيفي")
      {
        req.body.sem_type = 3;
      }
    id = req.params.id;
    models.Semester.find({
      where: {
        id: id
      }
      }).then(function (todo) {
      todo.updateAttributes(req.body).then(function (todo) {
        res.redirect('/semester/'+req.params.id);
      }).catch(function (err) {
          console.log(err);
      });

       });
       });

router.get('/semester/:ids/:id',userHelpers.isLogin, function(req, res) {
  models.Semester.findOne({
    where: {
      id: req.params.ids,
      status: 1
    }
  }).then(function(sem){
  
  models.Faculty_member.findAll({
    where:{
      status:1
    }
  }).then(function(faculty){
    models.Location.findAll({
      where:{
        status:1
      }
    }).then(function(location){
      models.Division.findAll({
        where:{
          DepartmentId:req.params.id
        },

        include:[
        {
          model: models.DivisionSubject,
            required:false,
              where:{
              status:1
              
            },
            include:[{
              model: models.Subject,
              required:false,
              where:{
                status:1,
                system_type : sem.system_type
              }
            }]
        },

        {
          model: models.Sub_group,
          required:false,
          where:{
          SemesterId:req.params.ids
        },
        include:[{
          model: models.Subject,
          required:false,
          where:{
            status:1
          }

          },{
            model: models.Faculty_member,
            required:false,
              where:{
              status:1
            }
          },{
            model: models.Location,
            required:false,
            where:{
              status:1
            }
          }
        ],
        }],
      }).then(function(sub){
        models.Department.findOne({
          where:{id:req.params.id}
        }).then(function(dep){
          res.render('subGroup', { title: 'Get Sub Group', name:req.session.name,departmentID:req.params.id,semesterID:req.params.ids,faculty:faculty,location:location ,division:sub,semester:sem,dep:dep}); 
        });
        

      });
    });
  });
});
}); 

router.post('/subGroup',userHelpers.isLogin, function(req, res) {
  req.body.UserId=req.session.idu;
  models.Sub_group.create(req.body).then(function(sub) {
    // obj={
    //   UserId:1,
    //   SubjectId:req.body.SubjectId,
    //   LocationId:req.body.LocationId,
    //   SemesterId:req.body.SemesterId,
    //   SubGroupId:sub.id,

      
    // }
    // models.Timeline.create(obj).then(function(){

    models.Sub_group.findOne({
      where:{
        id:sub.id
      },
      include:[{
        model: models.Faculty_member,
          required:false,
            where:{
            status:1
          }
        },{
          model: models.Subject,
          required:false,
          where:{
            status:1
          }
        },{
          model: models.Location,
            required:false,
            where:{
              status:1
            }
        }]

    }).then(function(result){
      res.send(result);  
    });
  // });    
  });
});
router.post('/updateSub',userHelpers.isLogin, function(req, res) {
  models.Sub_group.update(req.body.body,{
    where: {
      id:req.body.id
    }
    }).then(function(result){
    models.Sub_group.findOne({
      where:{
        id:req.body.id
      },
      include:[{
        model: models.Faculty_member,
          required:false,
            where:{
            status:1
          }
        },{
          model: models.Subject,
          required:false,
          where:{
            status:1
          }
        },{
          model: models.Location,
            required:false,
            where:{
              status:1
            }
        }]
    }).then(function(result){
      res.send(result);  
    });
  });
});


router.get('/deleteSubGroup/:id',userHelpers.isLogin, function(req, res) {
  models.Sub_group.destroy({
    where:{
      id:req.params.id
    }
  }).then(function(){
    where: {
      id: req.params.id
    }      
  }).then(function (todo) {
    res.send({msg:"1"});
  }).catch(function (err) {
    res.send({msg:"2"});
  });
});

router.get('/deleteSemesters/:id', function(req, res) {
  models.Semester.destroy({
    where: {
      id: req.params.id
    }      
  }).then(function (todo) {
    res.send({msg:"1"});
  }).catch(function (err) {
    res.send({msg:"2"});
  });
});
// End Semester /////////////////////////////////////////////////////////


module.exports = router;