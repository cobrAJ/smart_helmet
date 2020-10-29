﻿/*
* Copyright (C) 2012-2018 Doubango Telecom <http://www.doubango.org>
* License: BSD
* This file is part of Open Source sipML5 solution <http://www.sipml5.org>
*/

function tsk_api_add_js_script(s_elt) {
    var tag_hdr = document.getElementsByTagName(s_elt)[0];
    for (var i = 1; i < arguments.length; ++i) {
        var tag_script = document.createElement('script');
        tag_script.setAttribute('type', 'text/javascript');
        tag_script.setAttribute('src', arguments[i] + "?svn=252");
        tag_hdr.appendChild(tag_script);
    }
};

tsk_api_add_js_script('head',
    'static//src/adapter.js',

    'static/src/tinySAK/src/tsk_base64.js',
    'static/src/tinySAK/src/tsk_buff.js',
    'static/src/tinySAK/src/tsk_fsm.js',
    'static/src/tinySAK/src/tsk_md5.js',
    'static/src/tinySAK/src/tsk_param.js',
    'static/src/tinySAK/src/tsk_ragel.js',
    'static/src/tinySAK/src/tsk_string.js',
    'static/src/tinySAK/src/tsk_utils.js'
);