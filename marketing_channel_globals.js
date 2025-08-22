// marketing_channel_globals.js - Example Data

export const examples = {
	paidSearch: {
		href: "https://www.originenergy.com.au/electricity-gas/plans.html?planfuel=Elec_Gas&cid=ps:paid-search",
		referrer: "https://www.google.com/",
	},
	naturalSearch: {
		href: "https://www.originenergy.com.au/electricity-gas/plans.html?natural-search",
		referrer: "https://www.bing.com/",
	},
	email1: {
		href: "https://www.originenergy.com.au/electricity-gas/plans.html?cid=em:email-example1",
		referrer: "",
	},
	email2: {
		href: "https://www.originenergy.com.au/electricity-gas/plans.html?serviceid=em:service-id",
		referrer: "",
	},
	offline: {
		href: "https://www.originenergy.com.au/pay-my-bill?cid=qr:code",
		referrer: "",
	},
	vanity: {
		href: "https://www.originenergy.com.au/some-shop-referrall?cid=vt:vanity-url",
		referrer: "",
	},
	sms: {
		href: "https://www.originenergy.com.au/sms/?cid=sms:message",
		referrer: "",
	},
	push: {
		href: "https://www.originenergy.com.au/push.html?cid=push:notification",
		referrer: "",
	},
	display1: {
		href: "https://www.originenergy.com.au/cid-starts-with?cid=di-displayclickthrough-1",
		referrer: "",
	},
	display2: {
		href: "https://www.originenergy.com.au/clean-url:d",
		referrer: "",
	},
	display3: {
		href: "https://www.originenergy.com.au/?ef_id=abc:d",
		referrer: "",
	},
	socialNetwork1: {
		href: "https://www.originenergy.com.au/lpg/offers/",
		referrer: "https://m.facebook.com/",
	},
	socialNetwork2: {
		href: "https://www.originenergy.com.au/lpg/offers/?cid=sc:socialnetwork-example",
		referrer: "https://facebook-adserver.com/",
	},
	thirdParty: {
		href: "https://www.originenergy.com.au/internet/plans/?cid=tp:third-party-example",
		referrer: "https://canstar.com/",
	},
	universalLink: {
		href: "https://www.originenergy.com.au/mobile-app?cid=ul:universal-link-example",
		referrer: "",
	},
	magicLink: {
		href: "https://www.originenergy.com.au/pay-bill?cid=ml:magic-link-example",
		referrer: "",
	},
	referringDomains1: {
		href: "https://www.originenergy.com.au/about",
		referrer: "https://example.com/",
		page_views_session: "1",
	},
	referringDomains2: {
		href: "https://www.originenergy.com.au/about?cid=rd:referring-domain-example",
		referrer: "https://some-domain.com/",
	},
	displayViewThrough1: {
		href: "https://www.originenergy.com.au/:i",
		referrer: "https://clean-url.com/",
	},
	displayViewThrough2: {
		href: "https://www.originenergy.com.au/for-home/electricity-and-gas/info/find-my-distributor/?ef_id=EAIaIQobChMImZGp5YeJjgMVtaRmAh2yJCBiEAAYASAAEgKkEvD_BwE:G:s&s_kwcid=AC!4533!3!!!!x!!&gad_source=1&gad_campaignid=22547263392&gbraid=0AAAAAD3YqiGmRzCdgwfPCJaKKy788",
		referrer: "https://amo.com/",
	},
	originApp1: {
		href: "https://www.originenergy.com.au/app?scope=native"
	},
	originApp2: {
		href: "https://www.originenergy.com.au/app",
		userAgent: "Mozilla/5.0 (compatible; odin-mobile-app/1.0)"
	},
	originApp3: {
		href: "https://www.originenergy.com.au/app/oiw.html"
	},
	originApp4: {
		href: "https://www.originenergy.com.au/app?openInExtBrowser=true",
	},
	originApp5: {
		href: "https://www.originenergy.com.au/app",
		events: [{detail:{data:{isNative: "yes"}}}]
	},
	originApp6: {
		href: "https://www.originenergy.com.au/app",
		isNative: "yes"
	},
	internal: {
		href: "https://www.originenergy.com.au/internal-channel-example",
		referrer: "https://support.originenergy.com.au"
	},
	personalisation: {
		href: "https://www.originenergy.com.au/?cid=ccd:personalisation-example"
	},
	direct: {
		href: "https://www.originenergy.com.au/direct-channel-example",
		referrer: "",
		sessionStorage: {
			'com.adobe.reactor.core.visitorTracking.pagesViewed': "1"
		}
	}
};
