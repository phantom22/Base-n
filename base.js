class Base{constructor(b,bc){let t=this;t.BASE=b;t.BASE_CHARS=b<=26&&typeof bc=="undefined"?"abcdefghijklmnopqrstuvwxyz".slice(0,b).split(""):bc.split("");Object.freeze(t)}parse(s){let n=0;for(let i=0;i<s.length;i++)n+=this._pc(s[i],s.length-1-i);return n}encode(n){let t=this;n=Math.abs(n);let r="";for(let m=t._em(n);m>-1;m--){let ts;for(let s=0;s<t.BASE_CHARS.length;s++){const cs=t._gs(m,s);if(cs>n){n-=ts;r+=t.BASE_CHARS[s-1];break}else if(cs==n||t._gs(m,s+1)>n){n-=cs;r+=t.BASE_CHARS[s];break}ts=cs}}return r}_gs(m,s){return this.BASE**m*s}_em(n){let t=this;let m;for(m=0;m<200;m++){const step=t._gs(m,t.BASE_CHARS-1);const nextStep=t._gs(m+1,1);if(step>=n||nextStep>n)break}return m}_pc(c,m){return this.BASE**m*this.BASE_CHARS.indexOf(c)}}