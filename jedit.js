col = new Meteor.Collection("col");

if (Meteor.isClient) {
  Template.jedit.itemin = function (name) {
    return window[name].find({});
  };
  Template.jelly.str = function (obj) {
    return JSON.stringify(obj);
  };
  window.flush = {
      
  };
  Template.jedit.events = {
    'click  .addtocol' : function (e,t) {
      window[t.data].insert({prop: 'value'});

    },
    'click .icon-resize-full' : function (e,t) {
      console.log('clone!', this, t);
      var clone = $.extend({}, this);
      delete clone._id;
      window[t.data].insert(clone);
    },
    'click .icon-picture' : function (e,t) {
      var parent = $(e.currentTarget).parents('.id');
      parent.toggleClass('picit');
    },
    'click .icon-pencil' : function (e,t) {
      var id = this._id;
      var toupdate = {};
      var toshow = {};
      $.extend(true, toshow, this);
      delete toshow._id;
      var newjson = prompt('edit', JSON.stringify(toshow));
      if (newjson) {
        $.extend(toupdate, JSON.parse(newjson));
        window[t.data].update({_id: id}, toupdate);
      }
    },
    'click span.val' : function (e,t) {
      $(e.currentTarget).hide().prev('input.val').show();
    },
    'click .hideit' : function (e,t) {
      e.stopPropagation();
      console.log($(e.currentTarget));
      var wells =  $(e.currentTarget).parent().find('.well');
      console.log(wells.length);
      $(wells[0]).toggle();
      return false;
    },
    'click .addprop' : function (e,t) {

      var id = $(e.currentTarget).parents('.id').attr('mid');
      var oval = this.val || this;
      var op = "$set";

      var ttype = $.isArray(this.val) ? 'Array' : typeof this.val;
      var propname = 'NEWPROP' + Object.keys(this.val || this).length;

      var thepath = this.key || '';
      if (ttype === 'Array') {
        op = "$push";
      }
      else {
          thepath += (thepath ? '.' + propname : propname);
      }

      console.log(this, $(e.currentTarget).val(), $(e.target).val(), thepath, id, ttype);

      var toset = {};
      toset[thepath] = 'NEWVAL';

      console.log('update', id, toset);
      debugger;
      var theset = {};
      theset[op] = toset;
      col.update(id, theset);
      return true;
    },
    'keydown .val' : function (e,t) {
      // template data, if any, is available in 'this'
      console.log('T', t);
      var path = [];
      var id = $(e.currentTarget).parents('.id').attr('mid');
      var parents = $(e.currentTarget).parents('.key');
      $.each(parents, function(i, el){
        path.push($(el).attr('key'));
      });

      var thepath = this.key;//path.reverse().join('.');
      console.log(this, $(e.currentTarget).val(), $(e.target).val(), thepath, id);
//      var ttype = typeof this.val || this;
      window.clearTimeout(flush[thepath]);
      window.flush[thepath] = setTimeout(function(){
        var toset = {};
//        toset[thepath] = ttype === 'number' ? parseInt($(e.target).val()) : $(e.target).val();
        toset[thepath] = $(e.target).val();
        console.log('update', id, toset);
        col.update(id, {$set : toset});
      },500);
      return true;
    }
  };

  Template.jelly.keys = function (x) {
    console.log('keys', x);
    var o = x;
    if (x.val) {
        o = x.val;
    }
    var p = x.key ? x.key + '.' : '';
    return  $.map(Object.keys(o), function(y){
      return {key: p + y,  val: o[y]};
    });
  };

  Template.shelly.skeys = function (x) {
    console.log('keys', x);
    var o = x;
    if (x.val) {
        o = x.val;
    }
    var p = x.key ? x.key + '.' : '';
    return  $.map(Object.keys(o), function(y){
      return {key: y,  val: o[y]};
    });
  };

  Template.shelly.isid = function(key){
      return key === '_id' || key === 'jeditp';
  };

  Template.jelly.isid = function(key){
      return key === '_id' || key === 'jeditp';
  };

  Template.jelly.simple = Template.shelly.simple = function (x) {
    return typeof x !== 'object';
  };
}

if (Meteor.isServer) {
  col.remove({});
  col.insert({name: 'Ayal', obj: {one: 1, two: [1,2]}});
  col.insert({name: 'bubu', obj: {one: 2, two: [1,4,{what: new Date()}]}});
  Meteor.startup(function () {
    
  });
}
