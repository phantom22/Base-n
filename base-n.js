class base{static encrypt(t,n,g,i){const e=g.split(""),l=i.split(""),B=BigInt(e.length),I=BigInt(l.length);let r,f=BigInt(0),o="";for(let n=0;n<t.length;n++)f+=B**BigInt(t.length-1-n)*BigInt(e.indexOf(t[n]));for(let t=BigInt(n.length-1);t>=0;t--)f+=B**t*BigInt(e.indexOf(n[Number(t)]))**BigInt(3);for(r=BigInt(0);I**r<=f&&I**(r+BigInt(1))<f;r++);for(;r>=0;r--)for(let t=BigInt(0);t<I;t++){const n=I**r,g=n*t;g<=f&&g+n>f&&(f-=g,o+=l[Number(t)])}return o}static decrypt(t,n,g,i){const e=g.split(""),l=i.split(""),B=BigInt(e.length),I=BigInt(l.length);let r,f=BigInt(0),o="";for(let n=0;n<t.length;n++)f+=B**BigInt(t.length-1-n)*BigInt(e.indexOf(t[n]));for(let t=BigInt(n.length-1);t>=0;t--)f-=I**t*BigInt(l.indexOf(n[Number(t)]))**BigInt(3);for(r=BigInt(0);I**r<=f&&I**(r+BigInt(1))<f;r++);for(;r>=0;r--)for(let t=BigInt(0);t<I;t++){const n=I**r,g=n*t;g<=f&&g+n>f&&(f-=g,o+=l[Number(t)])}return o}}