function FindProxyForURL(url, host) {
	if(shExpMatch(url,"*.youku.com/playlist/m3u8?keyframe=0&*")){return "PROXY 106.187.92.220:8123";}
	return "DIRECT";
}
