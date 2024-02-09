"use server";
import "server-only";

export async function speechToTextRecognizeOnce(formData: FormData) {
    try {

        console.log("Transcribe: ", formData);

        const docs = [
            'You: Compose a Community Engagement Report',
            'QChat: Title: Community Engagement Report',
            'Overview:',
            'Between January and February 2024, the Queensland Government embarked on a comprehensive community engagement campaign, using both digital and physical mediums to touch base with Queenslanders across the state. This report summarises the feedback from the community, which will inform our future policies and drive continuous improvement in our service delivery.',
            'Methods of Engagement:',
            '· Online Surveys: A total of 5,200 responses were received from various age groups and regions across Queensland.',
            '. Town Hall Meetings: 35 meetings were held in diverse locations, hosting around 800 community members.',
            '· Social Media Outreach: QLD Gov social media platforms were active in gathering opinions and discussion posts received thousands of comments.',
            '. Direct Emails: 650 emails were sent to us by members of the community, offering suggestions and concerns.',
            'Key Findings:',
            '. Health: The main concern expressed by respondents revolved around healthcare - particularly mental health services, access to specialist services in regional areas, and waiting times in hospitals.',
            '. Education: There were calls for improved digital infrastructure in schools, more support for students with special needs and additional professional development opportunities for teachers.',
            '. Environment: Strong interest was expressed around government actions towards tackling climate change, sustainability, and the preservation of natural reserves.',
            "· Employment and Economy: Participants suggested more support for local businesses, job creation, and protection for workers' rights.",
            'Recommendations and Future Actions:',
            'The Queensland Government acknowledges the valuable feedback from the community. In response, we will:',
            '· Health: Investigate parking solutions, consider measures to boost manpower and examine the feasibility of more decentralised healthcare systems.',
            '. Education: Conduct a comprehensive review of the current digital infrastructure in schools and explore resources to enhance support for students and teachers.',
            '· Environment: Outline a clear plan on tackling climate change and highlight the work being done in sustainability and preservation of natural reserves.',
            "· Employment and Economy: Reinforce initiatives around local business support and job creation, while examining current policies on workers' rights.",
            'Conclusion:',
            'The community engagement process was an invaluable exercise that unearthed deep insights',
            '1',
            'into the concerns, hopes, and aspirations of Queenslanders. The Queensland Government appreciates the participation of all citizens and will utilise this feedback in shaping initiatives and policies that reflect the needs of our residents. Drafted by the Queensland AI Unit, QChat.',
            '2'
        ];

        return docs;
    } catch (e) {
        console.log(e);
        return [];
    }
}