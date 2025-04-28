## Presentation
### OWASP Top 10 Security Risks
Links
* [Youtube](https://youtu.be/Di5M04xCHck)
* [Presentation](https://morven2018.github.io/Presentation/)

### Transcript 

#### 1 
Hello. today I'll want to tell you about Top 10 Security Risks by OWASP. 
#### 2 
First, let's figure out what OWASP is?
The Open Worldwide Application Security Project  (OWASP) is an online community that produces freely available articles, is an open community dedicated to enabling organizations to design, develop, acquire, operate, and maintain software for secure applications that can be trusted. 
#### 3 
Why do we know this top 10. This list is 10 most common vulnerabilities of web applications, with is actual to date. So we can make our application more secure and minimize risk of possible consequences of a cyberattack. Let's see to the latest the OWASP Top 10!
#### 4 
Broken Access Control is a security flaw that occurs when the access control mechanisms within a web application have weaknesses, are misconfigured, or are disregarded, that allow unauthorized individuals gain unauthorized access to restricted resources or perform actions beyond their authorized privileges.
This vulnerability usually occurs due to incorrect implementation authorization logic or incorrect configuration of permissions.
It is vulnerability is dangerous for several reasons: 

- Attackers can gain access to sensitive information (e.g. personal data or financial records). 
- Unauthorized user  can perform destructive actions, such as deleting records or changing data. 

#### 5 
Cryptographic failures are vulnerabilities related to inefficient data encryption or storing confidential information in the clear. 

The  reasons for cryptographic errors can be:

* Weak or outdated encryption algorithms. 
* Incorrect key management.
* Lack of encryption. 
* Problems with using of certificates. 
* Insecure management of user sessions


#### 6 
This attacks occur when someone insert untrusted or hostile data into command or query languages, or when user-supplied data is not validated, filtered, or sanitized by the application, leading to unintended execution of malicious commands. 
The purpose of this attack is to gain access to unauthorized information, or to manipulate the system behavior in favor of the attacker.

#### 7
Insecure Design (incorrect security configuration) is a weakness which occurs when an application is initially designed without security in mind. It makes application  sensitive to various attacks.

These risks can be reduce by use of threat modeling, secure design patterns, and reference architectures. 
#### 8 
Security misconfiguration is a cybersecurity issue that occurs when system or application settings are missing or incorrectly implemented, which may allow unauthorized access.  


Such errors can occur in any part of the IT environment, including networks, systems, applications, and cloud infrastructure.  

Some reasons that cause security misconfigurations:

* Using the default settings. 
* Incomplete configuration.
* No updating software. 
* Provision for users more permissions than necessary

#### 9
Using outdated, unmatched, or vulnerable components, such as library, frameworks, or plugins can increase the risk of violations. These risks can result from unsupported or out-of-date software, including the operating system (OS), web/application server, database management system (DBMS), applications, APIs, and all components, runtime environments, and libraries. These threats are particularly dangerous when organizations do not have timely, risk-based measures in place for fixing or upgrading a system’s underlying platform, frameworks, and dependencies, leaving the system open to days or weeks of unnecessary exposure to known risks. 

#### 10 
Identification and authentication failures are authentication—related weakness that occur when application does not adequately protect authentication and session management processes.

For example: an attacker can guess or intercept a user's password if the application allows the use of weak passwords or does not protect sessions.
#### 11 
Software and data integrity failures are weakness in software or infrastructure that allow an attacker to change or delete data without authorization.

To prevent type of attack we can:

* implement a verification process for all external plug-ins and libraries used in web applications; 4
* require the use of digital signatures to verify the authenticity and integrity of external code or data; 4
* regularly update and correct software components; 4
* monitor and log any suspicious or unauthorized activity inside the application; 4


#### 12 
Security logging and monitoring failures are security weakness that occur when a system or application does not log or monitor security events correctly. This allows attackers to gain unauthorized access to systems and data without detection.
#### 13 
Server-side request forgery (SSRF) is an attack in which an attacker operate a vulnerability in a web application to send requests on behalf of the server.


The consequences of attack are

* Hacking the internal network. 
* Burglary of important information. 
* Launching additional attacks.
#### 14 
Thank you for wathching my video and keep in mind the importance of security during development.
