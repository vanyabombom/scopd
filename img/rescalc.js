
function ResCalc()
{

this.Form = function()
{
  return document.forms['calcform'];
}

this.GetFieldValue = function(name,v_min,v_max)
{
  let control = this.Form()[name];

  if ( !control )
     {
       throw ('invalid control '+name);
     }
  
  let v = parseInt(control.value);
  if ( isNaN(v) || v < v_min || v > v_max )
     {
       control.focus();
       control.select();
       throw ('Введите значение от '+v_min+' до '+v_max);
     }

  return v;
}

this.GetFieldChecked = function(name)
{
  let control = this.Form()[name];
  
  if ( !control )
     {
       throw ('invalid control '+name);
     }
  
  return control.checked;
}

this.SetFieldSimple = function(name,value)
{
  let control = this.Form()[name];
  
  if ( !control )
     {
       throw ('invalid control '+name);
     }
  
  control.value = value;
}

this.SetFieldTraffic = function(name,Bps)
{
  let bps = Bps*8;
  
  let s;
  
  if ( bps == 0 )
     s = '-';
  else
  if ( bps < 1024 )
     s = bps + ' bits/s';
  else
  if ( bps < 1024*1024 )
     s = Math.round(bps/1024) + ' Kbits/s';
  else
  if ( bps < 10*1024*1024 )
     s = Math.round(bps/1024/1024*10)/10 + ' Mbits/s';
  else
  if ( bps < 1000*1024*1024 )
     s = Math.round(bps/1024/1024) + ' Mbits/s';
  else
     s = Math.round(bps/1024/1024/1000*10)/10 + ' Gbits/s';

  this.SetFieldSimple(name,s);
}

this.SetFieldSize = function(name,bytes)
{
  let s;
  
  if ( bytes == 0 )
     s = '-';
  else
  if ( bytes < 1024 )
     s = bytes + ' B';
  else
  if ( bytes < 1024*1024 )
     s = Math.round(bytes/1024) + ' KB';
  else
  if ( bytes < 1024*1024*1024 )
     s = Math.round(bytes/1024/1024) + ' MB';
  else
  if ( bytes < 1000*1024*1024*1024 )
     s = Math.round(bytes/1024/1024/1024) + ' GB';
  else
     s = Math.round(bytes/1024/1024/1024/1000*10)/10 + ' TB';

  this.SetFieldSimple(name,s);
}

this.Calc = function()
{
  try {

   const max_connections = 25000;
   const audio_traffic_Bps = 2000;

   let num_onlines = this.GetFieldValue('num_onlines',0,max_connections);
   let onlines_sshots_interval = this.GetFieldValue('onlines_sshots_interval',0,3600);
   onlines_sshots_interval = onlines_sshots_interval > 0 ? onlines_sshots_interval : 10000000;
   let onlines_audio = this.GetFieldChecked('onlines_audio');

   let num_pp = this.GetFieldValue('num_pp',0,max_connections);
   let pp_sshots_interval = this.GetFieldValue('pp_sshots_interval',0,3600);
   pp_sshots_interval = pp_sshots_interval > 0 ? pp_sshots_interval : 10000000;
   let pp_audio = this.GetFieldChecked('pp_audio');

   if ( num_onlines + num_pp > max_connections )
      {
        throw ('Общее кол-во машин превышает '+max_connections);
      }
   else
   if ( num_onlines + num_pp == 0 )
      {
        throw ('Общее кол-во машин равно 0');
      }

   let avg_sshot_size = this.GetFieldValue('avg_sshot_size',5,1000) * 1024;
   let avg_sc_size_per_sec = this.GetFieldValue('avg_sc_size',0,1000) * 1024 * 1024 / (9*60*60);
   let retro = this.GetFieldValue('retro',1,1000);
   let workdays = this.GetFieldValue('workdays',1,7);

   let sql_shared = this.GetFieldChecked('sql_shared');

   let k_sec2retro = (workdays/7)*retro*9*3600;
   
   let res_pp_traffic      = 10;
   let res_onlines_traffic = 20 + avg_sshot_size/onlines_sshots_interval + (onlines_audio?audio_traffic_Bps:0) + avg_sc_size_per_sec;
   let res_summary_traffic = res_pp_traffic*num_pp+res_onlines_traffic*num_onlines;
   let res_pp_space        = k_sec2retro*(20 + avg_sshot_size/pp_sshots_interval + (pp_audio?audio_traffic_Bps:0) + avg_sc_size_per_sec);
   let res_server_space    = k_sec2retro*(num_onlines*(avg_sshot_size/onlines_sshots_interval + (onlines_audio?audio_traffic_Bps:0) + avg_sc_size_per_sec));
   let res_server_drive    = 'HDD';
   let res_sql_space       = num_onlines*1300000*(retro*(workdays/7));
   let res_sql_drive       = num_onlines < 300 ? 'HDD' : 'SSD';
   let res_sql_edition     = res_sql_space < 8000000000 ? 'SQL Server Express / PostgreSQL' : 'SQL Server Standard / PostgreSQL';
   let res_server_cores    = Math.round(4+4*(num_onlines*1.0+num_pp*1.0)/10000);
   let res_server_ram      = Math.round(4+20*(num_onlines*1.0+num_pp*1.0)/25000);
   let res_sql_cores       = Math.round(1+3*(num_onlines)/25000);
   let res_sql_ram         = Math.round(3+10*(num_onlines)/25000);

   let vis_sql;

   if ( sql_shared )
      {
        res_server_cores += res_sql_cores;
        res_sql_cores = 0;
        res_server_ram += res_sql_ram;
        res_sql_ram = 0;

        vis_sql = false;
      }
   else
      {
        res_sql_cores += 1;
        res_sql_ram += 1;

        vis_sql = true;
      }
   
   this.SetFieldTraffic('res_onlines_traffic' , res_onlines_traffic );
   this.SetFieldTraffic('res_pp_traffic'      , res_pp_traffic      );
   this.SetFieldTraffic('res_summary_traffic' , res_summary_traffic );
   this.SetFieldSize   ('res_pp_space'        , res_pp_space        );
   this.SetFieldSize   ('res_server_space'    , res_server_space    );
   this.SetFieldSimple ('res_server_drive'    , res_server_drive    );
   this.SetFieldSize   ('res_sql_space'       , res_sql_space       );
   this.SetFieldSimple ('res_sql_drive'       , res_sql_drive       );
   this.SetFieldSimple ('res_sql_edition'     , res_sql_edition     );
   this.SetFieldSimple ('res_server_cores'    , res_server_cores    );
   this.SetFieldSimple ('res_server_ram'      , res_server_ram      );
   this.SetFieldSimple ('res_sql_cores'       , res_sql_cores       );
   this.SetFieldSimple ('res_sql_ram'         , res_sql_ram         );

   document.getElementById('results').style.display = '';
   document.getElementById('res_sql_cores').style.display = vis_sql?'':'none';
   document.getElementById('res_sql_ram').style.display = vis_sql?'':'none';

  } catch(e)
  {
    alert(e);
	return false;
  }
}

}
