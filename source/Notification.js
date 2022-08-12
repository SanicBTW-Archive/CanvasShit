//ver 3.2, uses a little portion of old code
class NotificationInstance
{
    notificationRegion = document.getElementById('notificationRegion');
    notificationRegHeader = document.getElementById('notifPanelHeader');
    notificationRegContent = document.getElementById('notifPanelContent');
    dismissTime = 0.0;
    timer;
    notification = document.createElement('div');

    constructor(mainText, subText = '', backgroundColor = 'transparent', mainBarColor = 'dimgray', progressBarColor = 'lightgreen')
    {
        this.notification.style.cssText += `height: fit-content; overflow-x: hidden; transition: 0.5s; position: relative; left: -2000px; background-color: ${backgroundColor};`;

        var content = document.createElement('div');

        var text = document.createElement('div');
        text.style.cssText += "margin-left: 1rem; margin-right: 1rem;";
        var main = document.createElement('h1');
        var sub = document.createElement('p');

        main.innerText = mainText;
        sub.innerText = subText;

        text.appendChild(main);
        text.appendChild(sub);

        var mainBar = document.createElement('div');
        mainBar.style.cssText += `background-color: ${mainBarColor}; width: 100%;`;
        var progBar = document.createElement('div');
        progBar.style.cssText += `width: 0%; height: 5px; transition: 1s; background-color: ${progressBarColor};`;

        mainBar.appendChild(progBar);

        content.appendChild(text);
        content.appendChild(mainBar);

        this.notification.appendChild(content);
        this.notificationRegContent.appendChild(this.notification);
        if(detectDeviceType() == "Desktop")
        {
            if(this.notificationRegion.style.width != "25%")
            {
                this.notificationRegion.style.width = "25%";
            }
        }
        else
        {
            if(this.notificationRegion.style.width != "100%")
            {
                this.notificationRegion.style.width = "100%";
            }
        }
        this.notificationRegHeader.style.opacity = "1";
        this.notificationRegContent.style.opacity = "1";

        window.setTimeout((tim) => {
            this.notification.style.left = "0px";
            window.clearTimeout(tim);
        }, 5);

        this.timer = setInterval(() => {
            this.dismissTime += 0.5;

            progBar.style.width = this.dismissTime + "%";

            if(this.dismissTime == 400)
            {
                this.notification.style.left = "2000px";
                
                window.setTimeout((tim2) => {
                    this.notificationRegContent.removeChild(this.notification);
                    if(this.notificationRegContent.childNodes.length == 1)
                    {
                        this.notificationRegContent.style.opacity = "0";
                        this.notificationRegHeader.style.opacity = "0";
                        this.notificationRegion.style.width = "0%";
                    }
                    window.clearTimeout(tim2);
                }, 150);
                this.onFinish();
            }
        }, 2);
    }

    onFinish = function()
    {
        console.log("Finished notifying!");
    }
}