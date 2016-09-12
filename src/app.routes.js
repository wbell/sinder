'use strict';

var moment = require('moment');

var routes = function routes($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/login');

  $stateProvider

  // login
  .state({
    name: 'login',
    url: '/login',
    templateUrl: './src/components/login/views/login/login.html',
    controller: 'lennarCRM.loginModule.loginCtrl'
  })

  // agenda page
  .state({
    name: 'agenda',
    url: '/agenda',
    templateUrl: './src/components/agenda/views/agenda/agenda.html',
    controller: 'lennarCRM.agendaModule.agendaCtrl',
    resolve: {
      'recordTypes': [
        'lennarCRM.remoteObjectsModule.recordTypeFactory',
        function(recordTypeFactory){
          return recordTypeFactory.getAllRecordTypeIds();
        }
      ]
    }
  })

  // customer detail page
  .state({
    name: 'customerDetail',
    url: '/customer/:accountId/:id/:opp/:activity/:eventId',
    templateUrl: './src/components/customer-detail/views/customer-detail/customerDetail.html',
    controller: 'lennarCRM.customerDetailModule.customerDetailCtrl',
    resolve: {
      'customer': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        function(api, mappingsFactory, fieldsFactory, $stateParams){
          var objType = mappingsFactory.parseIdForType($stateParams.id);

          var query = {
            object: objType,
            id: $stateParams.id,
            fields: fieldsFactory.getFields(objType)
          };

          if(objType==='Contact') {
            // This is a contact
            //query.fields.push('Realtor_Contact__c.Name');
          } else {
            // This is a lead
            query.fields.push('Realtor__r.Name');
          }

          //console.log(query);

          return api.get(query).then(function(res){
            return res.records[0];
          });

        }

      ],
      'household': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        '$log',
        function(api, mappingsFactory, fieldsFactory, $stateParams, $log){
          var objType = mappingsFactory.parseIdForType($stateParams.accountId);

          if(objType !== 'Account'){
            $log.warn('Account ID not found, fetch via controller');
            return null;
          }

          $log.debug('$stateParams', $stateParams);

          return api.get({
            object: 'Account',
            id: $stateParams.accountId,
            fields: fieldsFactory.getFields('Account')
          }).then(function(res){
            return res.records[0];
          });
        }
      ],
      'appointments': [
        'lennarCRM.apiModule.apiFactory',
        '$stateParams',
        function(api, $stateParams){
          return api.get({
            object: 'Event',
            fields: [
              'Id',
              'Customer_Attendance__c', // status
              'OwnerId', // Appt owner
              'StartDateTime', // start time
              'EndDateTime', // end time
              'Activity_Business_Unit_Community__r.Name',
              'Activity_Business_Unit_Community__r.Id',
              'Activity_Business_Unit_Community__c',
              'WhoId', // customer id,
              'WhatId'
            ],
            query: {
              remote: {
                where: {
                  and: {
                    ActivityDate: {gte: moment().toDate()},
                    WhoId: {eq: $stateParams.id}
                  }
                }
              },
              soql: [
                'WHERE',
                'ActivityDate >= ' + moment().format('YYYY-MM-DD'),
                'AND',
                'WhoId = \'' + $stateParams.id + '\''
              ]
            },
            limit: 100
          }).then(function(response){
            return response.records;
          });
        }
      ],
      'leadMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Lead',
            field: null
          });
        }
      ],
      'contactMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Contact',
            field: null
          });
        }
      ],
      'accountMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Account',
            field: null
          });
        }
      ],
      'opportunities': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        function(api, fieldsFactory, $stateParams){
          var options = {
            object: 'Opportunity',
            fields: fieldsFactory.getFields('Opportunity')
            .concat([
              'Opportunity_Business_Unit_Community__r.Name'
            ]),
            query: {
              remote: {
                where: {
                  and: {
                    IsClosed: {
                      eq: false
                    },
                    Primary_Contact__c: {
                      eq: $stateParams.id
                    }
                  }
                }
              },
              soql: [
                'WHERE',
                'IsClosed = false',
                'AND',
                'Primary_Contact__c = \'' + $stateParams.id + '\''
              ]
            },
            limit: 100
          };

          return api.get(options).then(function(response){
            return response.records;
          });
        }
      ],
      'opportunity': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        '$log',
        function(api, mappingsFactory, fieldsFactory, $stateParams, $log){

          if(!$stateParams.opp){
            $log.warn('Opp ID not found, Ignore, maybe a lead');
            return null;
          }
          return $stateParams.opp;
        }
      ],
      'activity': [
        '$stateParams',
        '$log',
        function ($stateParams, $log) {
          $log.debug('$stateParams', $stateParams);
          return $stateParams.activity;
        }
      ],
      'eventId': [
        '$stateParams',
        '$log',
        function ($stateParams, $log) {
          $log.debug('Event: ', $stateParams.eventId);
          return $stateParams.eventId;
        }
      ],
      'recordTypes': [
        'lennarCRM.remoteObjectsModule.recordTypeFactory',
        function(recordTypeFactory){
          return recordTypeFactory.getAllRecordTypeIds();
        }
      ],
      'realtor': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        '$log',
        function(api, mappingsFactory, fieldsFactory, $stateParams, $log){

          if(!$stateParams.opp){
            $log.warn('Opp ID not found, Ignore, maybe a lead');
            return null;
          }

          var opts = {
            object: 'OpportunityContactRole',
            fields: [
              'ContactId',
              'OpportunityId',
              'Role'
            ],
            query: {
              remote: {
                where: {
                  and: {
                    Role: {eq: 'Realtor'},
                    OpportunityId: {eq: $stateParams.opp}
                  }
                }
              },
              soql: [
                'WHERE',
                'Role = \'Realtor\'',
                'AND',
                'OpportunityId = \'' + $stateParams.opp + '\''
              ]
            },
            limit: 1
          };

          return api.get(opts).then(function(response){
            if(response.records.length) {
              var query = {
                object: 'Contact',
                id: response.records[0].ContactId,
                fields: ['Id','Name']
              };
              return api.get(query).then(function(res){
                return res.records[0];
              });
            } else {
              return false;
            }
          });
        }
      ]
    }
  })

  // walk-in form
  .state({
    name: 'walkinForm',
    url: '/walk-in/:leadId',
    templateUrl: './src/components/walk-in/views/walk-in-form/walkin.html',
    controller: 'lennarCRM.walkinModule.walkinCtrl',
    resolve: {
      'lead': [
        '$stateParams',
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.walkinModule.walkinFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        function($stateParams, api, walkinFactory, fieldsFactory){

          if(!$stateParams.leadId){
            return walkinFactory.getNew();
          }

          return api.get({
            object: 'Lead',
            id: $stateParams.leadId,
            fields: fieldsFactory.getFields('Lead')
          }).then(function(response){
            return response.records[0];
          });
        }
      ],
      leadMeta: [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Lead',
            field: null
          });
        }
      ],
      'recordTypes': [
        'lennarCRM.remoteObjectsModule.recordTypeFactory',
        function(recordTypeFactory){
          return recordTypeFactory.getAllRecordTypeIds();
        }
      ]
    }
  })

  // add-lead form
  .state({
    name: 'addLead',
    url: '/add-lead',
    templateUrl: './src/components/add-lead/views/add-lead-form/addLead.html',
    controller: 'lennarCRM.addLeadModule.addLeadCtrl',
    resolve: {
      'lead': [
        'lennarCRM.addLeadModule.addLeadFactory',
        function(addLeadFactory){

          return addLeadFactory.getNew();
        }
      ],
      'leadMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Lead',
            field: null
          });
        }
      ],
      'recordTypes': [
        'lennarCRM.remoteObjectsModule.recordTypeFactory',
        function(recordTypeFactory){
          return recordTypeFactory.getAllRecordTypeIds();
        }
      ]
    }
  })

  // add appointment
  .state({
    name: 'addAppointment',
    url: '/addvisit/:accountId/:id',
    templateUrl: './src/components/add-appointment/views/add-appointment/addAppointment.html',
    controller: 'lennarCRM.addAppointmentModule.addAppointmentCtrl',
    params: {
      returnObj: null
    },
    resolve: {
      'account': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        function(api, mappingsFactory, fieldsFactory, $stateParams){
          if($stateParams.accountId){
            return $stateParams.accountId;
          }

          if($stateParams.id){
            var objType = mappingsFactory.parseIdForType($stateParams.id);

            return api.get({
              object: objType,
              id: $stateParams.id,
              fields: fieldsFactory.getFields(objType)
            }).then(function(res){
              return res.records[0].AccountId;
            });

          }
        }
      ],
      'customer': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',

        function(api, mappingsFactory, fieldsFactory, $stateParams){
          if($stateParams.id){
            var objType = mappingsFactory.parseIdForType($stateParams.id);

            return api.get({
              object: objType,
              id: $stateParams.id,
              fields: fieldsFactory.getFields(objType)
            }).then(function(res){
              return res.records[0];
            });

          } else {
            return $stateParams.accountId;
          }
        }
      ],
      'household': [
        'lennarCRM.apiModule.apiFactory',
        'lennarCRM.remoteObjectsModule.mappingsFactory',
        'lennarCRM.remoteObjectsModule.fieldsFactory',
        '$stateParams',
        '$log',
        function(api, mappingsFactory, fieldsFactory, $stateParams, $log){
          var objType = mappingsFactory.parseIdForType($stateParams.accountId);

          if(objType !== 'Account'){
            $log.warn('Account ID not found, fetch via controller');
            return null;
          }

          return api.get({
            object: 'Account',
            id: $stateParams.accountId,
            fields: fieldsFactory.getFields('Account')
          }).then(function(res){
            return res.records[0];
          });
        }
      ],
      'appointments': [
        'lennarCRM.apiModule.apiFactory',
        '$stateParams',
        function(api, $stateParams){
          if(!$stateParams.id) return [];

          return api.get({
            object: 'Event',
            fields: [
              'Id',
              'Customer_Attendance__c', // status
              'StartDateTime', // start time
              'EndDateTime', // end time
              'Activity_Business_Unit_Community__r.Name',
              'Activity_Business_Unit_Community__r.Id',
              'WhoId' // customer id
            ],
            query: {
              remote: {
                where: {
                  and: {
                    ActivityDate: {gte: moment().toDate()},
                    WhoId: {eq: $stateParams.id}
                  }
                }
              },
              soql: [
                'WHERE',
                'ActivityDate >= ' + moment().format('YYYY-MM-DD'),
                'AND',
                'WhoId = \'' + $stateParams.id + '\''
              ]
            },
            limit: 100
          }).then(function(response){
            return response.records;
          });
        }
      ],
      'contactMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Contact',
            field: null
          });
        }
      ],
      'accountMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Account',
            field: null
          });
        }
      ],
      'eventMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Event',
            field: null
          });
        }
      ],
      'recordTypes': [
        'lennarCRM.remoteObjectsModule.recordTypeFactory',
        function(recordTypeFactory){
          return recordTypeFactory.getAllRecordTypeIds();
        }
      ]
    }
  })

  // edit appointment
  .state({
    name: 'editAppointment',
    url: '/edit-appointment/:id',
    templateUrl: './src/components/add-appointment/views/edit-appointment/editAppointment.html',
    controller: 'lennarCRM.addAppointmentModule.editAppointmentCtrl',
    resolve: {
      'recordTypes': [
        'lennarCRM.remoteObjectsModule.recordTypeFactory',
        function(recordTypeFactory){
          return recordTypeFactory.getAllRecordTypeIds();
        }
      ],
      'appointment': [
        'lennarCRM.apiModule.apiFactory',
        '$stateParams',
        function(api, $stateParams){
          var options = {
            object: 'Event',
            fields: [
              'Id',
              'Customer_Attendance__c', // status
              'StartDateTime', // start time
              'EndDateTime', // end time
              'Activity_Business_Unit_Community__r.Name',
              'Activity_Business_Unit_Community__r.Id',
              'WhoId' // customer id
            ],
            query: {
              remote: {
                where: {
                  Id: {eq: $stateParams.id}
                }
              },
              soql: [
                'WHERE',
                'Id = \'' + $stateParams.id + '\''
              ]
            }
          };

          return api.get(options).then(function(response){
            return response.records[0];
          });
        }
      ],
      'eventMeta': [
        'lennarCRM.apiModule.apiFactory',
        function(api){
          return api.getFieldMeta({
            object: 'Event',
            field: null
          });
        }
      ]
    }
  });

};

module.exports = routes;
