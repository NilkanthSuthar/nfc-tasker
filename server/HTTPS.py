from flask import Flask, request, render_template, jsonify
from grovepi import *
import time

app = Flask(__name__, static_folder='static')

@app.route('/')
def home():
    return render_template('home.html')


last_state= 'off'
@app.route('/operate_relay', methods=['POST'])
def operate_relay():
    
    data = request.get_json()
    s = data.get('message', '')
    state, port = s.split(' ')
    port= int(port)
    def device( port, state):
        global last_state
        def Blinking():
            for _ in range(10):
                digitalWrite(port,1)                                  
                time.sleep(1)
                digitalWrite(port,0)                                
                time.sleep(1)
            return True
            
        if state == 'toggle':
            if last_state == 'on':
                digitalWrite(port, 0)
                last_state = 'off'
                print('Turning off Light')
                return 'Light turned off'
            elif last_state == 'off':
                digitalWrite(port, 1)
                last_state = 'on'
                print('Turning on Light')
                return 'Light turned on'
            else:
                return 'Invalid state'

        elif state == 'on':
            if last_state != 'on':
                digitalWrite(port, 1)
                last_state = 'on'
                print('Turning on Light')
            return 'Light already on'       
            
        elif state == 'blink':
            if last_state != 'blink':
                last_state = 'off'
                print('Blinking')
                while Blinking():
                    return 'Blinking'
            else:
                return 'Already Blinking'

        elif state == 'off':
            if last_state != 'off':
                digitalWrite(port, 0)
                last_state = 'off'
                print('Turning off Light')
            return 'Light already off'
        else:
            print(last_state, port, state)
            return 'Error?'

    return device(port, state)


import socket
def get_ip():
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        s.connect(('10.255.255.255', 1))
        IP = s.getsockname()[0]
    except:
        IP = '127.0.0.1'
    finally:
        s.close()
    return IP

if __name__ == '__main__':
    
    app.run(host=get_ip(), port=8080)